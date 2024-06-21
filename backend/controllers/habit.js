import Habit from '../models/habit.js';
import User from '../models/user.js';

/**
 * Creates a new habit for the user based on the provided details.
 * Validates the required fields and adds the habit to the database.
 * @param {Request} req - The request object, containing user and habit details.
 * @param {Response} res - The response object used to return the status and created habit.
 */
export const addHabit = async (req, res, next) => {
    const { name, habitPeriod, goal, effectiveDate, difficulty } = req.body;

    // Validate input data
    if (!name || !habitPeriod || !goal || !effectiveDate || !difficulty) {
        return res.status(400).json({
            message: 'All fields (name, habitPeriod, goal, effectiveDate, difficulty) must be provided'
        });
    }

    try {
        const user = await User.findById(req.user._id);

        if (user.subscriptionType !== 'pro') {
            const habitCount = await Habit.countDocuments({ user: req.user._id });
            if (habitCount >= 2) {
                return res.status(400).json({
                    message: 'Free tier users can only have a maximum of 2 habits'
                });
            }
        }

        const newHabit = new Habit({
            user: req.user._id,  // Assuming user ID is available from auth middleware
            name,
            habitPeriod,
            consistencyGoals: {
                goal: goal,
                effectiveDate: new Date(effectiveDate) // Ensure the date is properly formatted
            },
            difficulty
        });
        await newHabit.save();
        res.status(201).json(newHabit);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            message: 'Something went wrong while creating the habit',
            error: error.message
        });
    }
};

/**
 * Retrieves all habits for the user, enriching them with heatmap data and weekly occurrences.
 * Each habit's data is enhanced with visual and performance insights.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the list of habits.
 */
export const getHabits = async (req, res, next) => {
    try {
        const habits = await Habit.find({ user: req.user._id });
        const habitsWithData = await Promise.all(habits.map(async (habit) => {
            const heatmapData = await habit.getHeatmapData();
            if (habit.name === "Walking Stanley") {
                console.log(heatmapData)
            }
            const occurrences = habit.getWeeklyOccurrences();
            return {
                ...habit.toObject(),
                heatmapData,
                occurrences
            };
        }));
        res.json(habitsWithData);
    } catch (error) {
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
    const { name, habitPeriod, goal, effectiveDate, difficulty, completionChange, date } = req.body;

    try {
        const updateFields = {};

        // Update basic fields if provided
        if (name) updateFields.name = name;
        if (habitPeriod) updateFields.habitPeriod = habitPeriod;
        if (difficulty) updateFields.difficulty = difficulty;

        // Handle goal updates with validation and error handling
        if (goal && effectiveDate) {
            const goalEntry = { goal, effectiveDate: new Date(effectiveDate) };
            updateFields.consistencyGoals = goalEntry;
        }

        // Update completions for a specific date if provided
        if (typeof completionChange === 'number' && date) {
            const habit = await Habit.findById(habitId);
            if (!habit) {
                const error = new Error('Habit not found');
                error.status = 404;
                throw error;
            }

            await habit.changeCompletion(date, completionChange);
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
        next(error);
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
            throw error;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
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
        const { completionChange, date } = req.body;

        try {
            const habit = await Habit.findById(habitId);
            if (!habit) {
                const error = new Error('Habit not found');
                error.status = 404;
                throw error;
            }
            await habit.changeCompletion(date, completionChange);
            await habit.save(); // Ensure the habit is saved with the updated streak
            res.json(habit);
        } catch (error) {
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
    const { habitId } = req.params;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            const error = new Error('Habit not found');
            error.status = 404;
            throw error;
        }

        const streak = await habit.calculateStreak();
        res.json({ streak });
    } catch (error) {
        next(error);
    }
};

