import { DailySchedule } from "../models/dailySchedule.js";
import { startOfWeek, endOfWeek } from 'date-fns';
import mongoose from 'mongoose'

/**
 * Retrieves the daily schedule for the user for the current date.
 * If no schedule exists for the current date, a new one is created.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the daily schedule.
 */
export const getDailySchedule = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        let schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        if (!schedule) {
            schedule = new DailySchedule({ userId: req.user._id, date: today, timeBlocks: [] });
            await schedule.save();
        }
        res.json(schedule);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Adds a time block to the daily schedule for the current date.
 * @param {Request} req - The request object, containing time block details.
 * @param {Response} res - The response object used to return the updated schedule.
 */
export const addTimeBlock = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { name, startTime, endTime, tasks, category } = req.body;

    if (!name || !startTime || !endTime || !category) {
        const error = new Error('Name, start time, end time, and category must be provided');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        schedule.timeBlocks.push({ name, startTime, endTime, tasks, category });
        await schedule.save();
        res.json(schedule);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Updates a specific time block within the daily schedule for the current date.
 * @param {Request} req - The request object, including time block ID and update details.
 * @param {Response} res - The response object used to return the updated schedule.
 */
export const updateTimeBlock = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { blockId } = req.params;
    const { name, startTime, endTime, tasks, category, completed } = req.body;

    try {
        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        const block = schedule.timeBlocks.id(blockId);
        if (block) {
            block.name = name || block.name;
            block.startTime = startTime || block.startTime;
            block.endTime = endTime || block.endTime;
            block.tasks = tasks || block.tasks;
            block.category = category || block.category;
            block.completed = completed !== undefined ? completed : block.completed;
            await schedule.save();
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Time block not found' });
        }
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Deletes a specific time block from the daily schedule for the current date.
 * @param {Request} req - The request object, including time block ID.
 * @param {Response} res - The response object used to confirm deletion.
 */
export const deleteTimeBlock = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { blockId } = req.params;

    try {
        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        const block = schedule.timeBlocks.id(blockId);
        if (block) {
            block.remove();
            await schedule.save();
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).json({ message: 'Time block not found' });
        }
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Starts the timer for a specific time block in the daily schedule.
 * @param {Request} req - The request object, including time block ID.
 * @param {Response} res - The response object used to return the updated schedule.
 */
export const startTimer = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { blockId } = req.params;

    try {
        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        const block = schedule.timeBlocks.id(blockId);
        if (block) {
            block.timerStartedAt = new Date();
            await schedule.save();
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Time block not found' });
        }
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Stops the timer for a specific time block in the daily schedule and logs the duration.
 * @param {Request} req - The request object, including time block ID.
 * @param {Response} res - The response object used to return the updated schedule.
 */
export const stopTimer = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { blockId } = req.params;

    try {
        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        const block = schedule.timeBlocks.id(blockId);
        if (block) {
            if (block.timerStartedAt) {
                const duration = (new Date() - new Date(block.timerStartedAt)) / 1000; // in seconds
                block.timerDuration += duration;
                block.timerStartedAt = null;
                await schedule.save();
                res.json(schedule);
            } else {
                res.status(400).json({ message: 'Timer not started' });
            }
        } else {
            res.status(404).json({ message: 'Time block not found' });
        }
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};


/**
 * Retrieves the weekly metrics for the user.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the weekly metrics.
 */
export const getWeeklyMetrics = async (req, res, next) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    try {
        // Fetch user preferences from the User model
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const preferences = user.preferences;
        if (!preferences) {
            return res.status(404).json({ message: 'User preferences not found' });
        }

        // Aggregate weekly metrics from daily schedules
        const weeklyMetrics = await DailySchedule.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startOfWeek }
                }
            },
            { $unwind: '$timeBlocks' },
            {
                $group: {
                    _id: '$timeBlocks.category',
                    hoursSpent: { $sum: { $divide: [{ $subtract: ['$timeBlocks.endTime', '$timeBlocks.startTime'] }, 3600000] } }
                }
            },
            {
                $project: {
                    category: '$_id',
                    hoursSpent: 1,
                    hoursLeft: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$_id', 'work'] }, then: { $subtract: [preferences.workHoursPerWeek, '$hoursSpent'] } },
                                { case: { $eq: ['$_id', 'leisure'] }, then: { $subtract: [preferences.leisureHoursPerWeek, '$hoursSpent'] } },
                                { case: { $eq: ['$_id', 'family_friends'] }, then: { $subtract: [preferences.familyFriendsHoursPerWeek, '$hoursSpent'] } },
                                { case: { $eq: ['$_id', 'atelic'] }, then: { $subtract: [preferences.atelicHoursPerWeek, '$hoursSpent'] } }
                            ],
                            default: 0
                        }
                    }
                }
            }
        ]);

        // Initialize default metrics for categories not present in the schedules
        const metrics = {
            work: { hoursSpent: 0, hoursLeft: preferences.workHoursPerWeek },
            leisure: { hoursSpent: 0, hoursLeft: preferences.leisureHoursPerWeek },
            family_friends: { hoursSpent: 0, hoursLeft: preferences.familyFriendsHoursPerWeek },
            atelic: { hoursSpent: 0, hoursLeft: preferences.atelicHoursPerWeek }
        };

        // Update the metrics with aggregated data
        weeklyMetrics.forEach(metric => {
            metrics[metric.category] = {
                hoursSpent: metric.hoursSpent,
                hoursLeft: metric.hoursLeft
            };
        });

        res.json(metrics);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Retrieves the total hours spent in each category for a specific week.
 * @param {Request} req - The request object, including the user ID and a date within the week.
 * @param {Response} res - The response object used to return the total hours by category.
 */
export const getWeeklyHoursByCategory = async (req, res, next) => {
    const userId = req.user._id;
    const date = req.query.date;

    // Calculate start and end dates of the week for the given date
    const startDate = startOfWeek(new Date(date));
    const endDate = endOfWeek(new Date(date));

    try {
        const result = await DailySchedule.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
            { $unwind: '$timeBlocks' },
            { $group: { _id: '$timeBlocks.category', totalDuration: { $sum: '$timeBlocks.timerDuration' } } }
        ]);

        const categoryHours = {
            work: 0,
            leisure: 0,
            family_friends: 0,
            atelic: 0,
        };

        for (const item of result) {
            categoryHours[item._id] = item.totalDuration / 3600; // Convert seconds to hours
        }

        res.json(categoryHours);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};