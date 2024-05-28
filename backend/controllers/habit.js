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
 * Retrieves all habits for the user, enriching them with heatmap data, performance rates, and weekly occurrences.
 * Each habit's data is enhanced with visual and performance insights.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the list of habits.
 */
export const getHabits = async (req, res, next) => {
    try {
        const habits = await Habit.find({ user: req.user._id });
        // Fetch heatmap data, all-time performance rates, and weekly occurrences for each habit
        const habitsWithData = await Promise.all(habits.map(async (habit) => {
            try {
                const heatmapData = await habit.getHeatmapData();
                const performanceRate = await habit.calculatePerformanceRate('all-time');  // Fetching all-time performance rate
                const occurrences = habit.getWeeklyOccurrences();  // Fetch weekly occurrences for the habit
                return {
                    ...habit.toObject(),  // Convert Mongoose document to plain object
                    heatmapData,
                    performanceRate,
                    occurrences  // Add weekly occurrences data to the enriched habit object
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
 * Updates a specific habit based on provided parameters such as new goal, habit name, or completion count.
 * Handles updates selectively and ensures consistency in the database.
 * @param {Request} req - The request object, including habit ID and update details.
 * @param {Response} res - The response object used to return the updated habit.
 */
export const updateHabit = async (req, res, next) => {
    const { habitId } = req.params;
    const { name, habitPeriod, newGoal, effectiveDate, completionChange, date } = req.body;

    try {
        const updateFields = {};

        // Update basic fields if provided
        if (name) updateFields.name = name;
        if (habitPeriod) updateFields.habitPeriod = habitPeriod;

        // Handle goal updates with validation and error handling
        if (newGoal && effectiveDate) {
            const goalEntry = { goal: newGoal, effectiveDate: new Date(effectiveDate) };
            updateFields.latestGoal = goalEntry;
            updateFields.$push = { consistencyGoals: goalEntry };
        }

        // Update completions for a specific date if provided
        if (typeof completionChange === 'number' && date) {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);

            const habit = await Habit.findById(habitId, { occurrences: 1, habitTotal: 1 });
            if (!habit) {
                const error = new Error('Habit not found');
                error.status = 404;
                throw error;
            }

            let occurrenceUpdated = false;
            habit.occurrences = habit.occurrences.map(occurrence => {
                if (new Date(occurrence.date).toDateString() === targetDate.toDateString()) {
                    occurrence.completions += completionChange;
                    occurrence.completions = Math.max(0, occurrence.completions);
                    occurrenceUpdated = true;
                }
                return occurrence;
            });

            if (!occurrenceUpdated) {
                habit.occurrences.push({ date: targetDate, completions: Math.max(0, completionChange) });
            }

            habit.habitTotal += completionChange;
            habit.habitTotal = Math.max(0, habit.habitTotal);

            await habit.save();
            res.json(habit);
            return;
        }

        const updatedHabit = await Habit.findByIdAndUpdate(habitId, updateFields, { new: true });
        if (!updatedHabit) {
            const error = new Error('Habit not found');
            error.status = 404;
            throw error;
        }

        res.json(updatedHabit);
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
 * Updates the completion count for a specified date for a habit.
 * If decreasing, it ensures completions don't go below zero. Also updates the streak.
 * @param {Request} req - The request object, containing the habit ID, new completion count, and the specific date.
 * @param {Response} res - The response object used to return the updated habit.
 */
export const updateHabitCompletion = async (req, res, next) => {
    const { habitId } = req.params;
    const { completionChange, date } = req.body; // Include date in the request body

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Parse the date string to a Date object
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);  // Normalize the date

        const updateResult = await habit.changeCompletion(targetDate, completionChange);

        if (!updateResult.success) {
            throw new Error(updateResult.message);
        }

        console.log('Habit completion updated:', habit.occurrences);
        res.json(habit);
    } catch (error) {
        console.error('Error updating habit completion:', error);
        res.status(400).json({ message: error.message });
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

