import Habit from '../models/habit.js';

/**
 * Creates a new habit for the user based on the provided details.
 * Validates the required fields and adds the habit to the database.
 * @param {Request} req - The request object, containing user and habit details.
 * @param {Response} res - The response object used to return the status and created habit.
 */
export const addHabit = async (req, res, next) => {
    console.log("User ID from req.user:", req.user._id); // Check if user ID is available
    const { name, habitPeriod, goal, effectiveDate } = req.body;

    // Validate input data
    if (!name || !habitPeriod || !goal || !effectiveDate) {
        const error = new Error('All fields (name, habitPeriod, goal, effectiveDate) must be provided');
        error.status = 400; // Set the HTTP status for the error
        return next(error);
    }

    try {
        const newHabit = new Habit({
            user: req.user._id,  // Assuming user ID is available from auth middleware
            name,
            habitPeriod,
            consistencyGoals: [{
                goal: goal,
                effectiveDate: new Date(effectiveDate) // Ensure the date is properly formatted
            }],
            latestGoal: {
                goal: goal,
                effectiveDate: new Date(effectiveDate)
            }
        });
        await newHabit.save();
        console.log('New habit added:', newHabit)
        res.status(201).json(newHabit);
    } catch (error) {
        // Pass any server-side errors to the error handling middleware
        next(error);
    }
};




/**
 * Retrieves all habits for the user, enriching them with heatmap data and performance rates.
 * Each habit's data is enhanced with visual and performance insights.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the list of habits.
 */
export const getHabits = async (req, res, next) => {
    try {
        const habits = await Habit.find({ user: req.user._id });
        // Fetch heatmap data and all-time performance rates for each habit
        const habitsWithData = await Promise.all(habits.map(async (habit) => {
            try {
                const heatmapData = await habit.getHeatmapData();
                const performanceRate = await habit.calculatePerformanceRate('all-time');  // Fetching all-time performance rate
                return {
                    ...habit.toObject(),  // Convert Mongoose document to plain object
                    heatmapData,
                    performanceRate
                };
            } catch (innerError) {
                // Log and encapsulate each error related to individual habit data fetching
                console.error(`Error fetching additional data for habit ${habit._id}:`, innerError);
                // Construct an informative error object and throw it to be caught by the outer catch
                const error = new Error(`Data enrichment failed for habit ${habit._id}`);
                error.status = 500; // Internal Server Error
                error.innerError = innerError; // Preserve original error details (optionally)
                throw error;
            }
        }));
        res.json(habitsWithData);
    } catch (error) {
        // Delegate any errors caught during processing to the error handling middleware
        next(error); 
    }
};



/**
 * Updates a specific habit based on provided parameters such as new goal or habit name.
 * Handles updates selectively and ensures consistency in the database.
 * @param {Request} req - The request object, including habit ID and update details.
 * @param {Response} res - The response object used to return the updated habit.
 */
export const updateHabit = async (req, res, next) => {
    const { habitId } = req.params;
    const { name, habitPeriod, newGoal, effectiveDate } = req.body;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            const error = new Error('Habit not found');
            error.status = 404;
            throw error;  // Throw the error to be caught by the catch block below
        }

        // Update basic fields if provided
        if (name) habit.name = name;
        if (habitPeriod) habit.habitPeriod = habitPeriod;

        // Handle goal updates with validation and error handling
        if (newGoal && effectiveDate) {
            await habit.updateGoal(newGoal, new Date(effectiveDate));
        }

        await habit.save();
        console.log('Habit updated:', habit);
        res.json(habit);
    } catch (error) {
        // Customize error handling for specific error types
        if (error instanceof mongoose.Error.ValidationError) {
            error.status = 400;  // Bad Request for validation errors
        } else if (error instanceof mongoose.Error.CastError) {
            error.status = 400;  // Bad Request for casting errors, typically invalid format
            error.message = 'Invalid ID format.';
        }
        next(error);  // Pass the error to the error handling middleware
    }
};

/**
 * Deletes a specific habit by its ID.
 * Verifies the habit's existence and removes it from the database.
 * @param {Request} req - The request object, containing the habit ID.
 * @param {Response} res - The response object used to confirm deletion.
 */
export const deleteHabit = async (req, res, next) => {
    const { habitId } = req.params;
    try {
        const deletedHabit = await Habit.findByIdAndDelete(habitId);
        if (!deletedHabit) {
            const error = new Error('Habit not found');
            error.status = 404;
            throw error; // Throw the error to be caught by the catch block
        }
        console.log('Habit deleted:', deletedHabit);
        res.status(204).send(); // No content to send back
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            error.status = 400; // Bad Request
            error.message = 'Invalid ID format.';
        }
        next(error); // Pass any caught error to the error handling middleware
    }
};

/**
 * Marks a habit as completed for the current date.
 * Updates habit's occurrences and recalculates the streak based on the completion.
 * @param {Request} req - The request object, containing the habit ID.
 * @param {Response} res - The response object used to return the updated habit.
 */
export const completeHabit = async (req, res, next) => {
    const { habitId } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Normalize the date for consistent comparison.

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            const error = new Error('Habit not found');
            error.status = 404;
            throw error;  // Throw the error to be caught by the catch block
        }

        await habit.incrementCompletion(currentDate);
        console.log('Habit completion updated:', habit);
        res.json(habit);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
            error.status = 400; 
            error.message = error instanceof mongoose.Error.CastError ? 'Invalid ID format.' : error.message;
        }
        next(error);  
    }
};


/**
 * Calculates and retrieves the current streak for a specified habit.
 * Uses the habit's internal logic to determine the length of the streak based on past completions.
 * @param {Request} req - The request object, containing the habit ID.
 * @param {Response} res - The response object used to return the streak data.
 */
export const calculateStreak = async (req, res, next) => {
    const { habitId } = req.params;  // Assume habitId is passed as a URL parameter

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            const error = new Error('Habit not found');
            error.status = 404;
            throw error; // Throw the error to be caught by the catch block
        }

        const streak = await habit.calculateStreak();  // Calculate the current streak
        res.json({ streak: streak });  // Respond with the streak value
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            error.status = 400;
            error.message = 'Invalid ID format.';
        }
        next(error);  // Pass any caught error to the error handling middleware
    }
};

