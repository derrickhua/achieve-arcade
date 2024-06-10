import { startOfWeek, endOfWeek } from 'date-fns';
import mongoose from 'mongoose';
import { DailySchedule, TimeBlock } from '../models/dailySchedule.js';
import Task from '../models/task.js';
import User from '../models/user.js';

/**
 * Retrieves the daily schedule for the user for the current date.
 * If no schedule exists for the current date, a new one is created.
 * Also retrieves tasks associated with today's time blocks.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the daily schedule.
 */
export const getDailySchedule = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        let schedule = await DailySchedule.findOne({ userId: req.user._id, date: today }).populate('timeBlocks.tasks');
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
        const timeBlock = new TimeBlock({ name, startTime, endTime, tasks, category, userId: req.user._id });
        
        // Update tasks to link them to this time block
        if (tasks && tasks.length > 0) {
            await Task.updateMany(
                { _id: { $in: tasks }, userId: req.user._id },
                { timeBlockId: timeBlock._id }
            );
        }

        schedule.timeBlocks.push(timeBlock);
        await schedule.save();
        await schedule.populate('timeBlocks.tasks').execPopulate();
        res.json(schedule);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Updates a specific time block within the daily schedule for the current date.
 * @param {Request} req - The request object, including time block ID and update details.
 * @param {Response} res - The response object used to return the updated time block.
 */
export const updateTimeBlock = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { blockId } = req.params;
    const { name, startTime, endTime, tasks, category, completed, timerDuration } = req.body;

    try {
        let allTasksCompleted = completed;

        if (tasks && tasks.length > 0) {
            // Ensure each task has a valid _id and update the tasks
            const taskIds = tasks.map(task => task._id);

            // Update tasks to link them to this time block
            await Task.updateMany(
                { _id: { $in: taskIds }, userId: req.user._id },
                { timeBlockId: blockId }
            );

            // Check if all tasks are completed
            const taskCompletionStatuses = await Task.find({ _id: { $in: taskIds }, userId: req.user._id }, 'completed');
            allTasksCompleted = taskCompletionStatuses.every(task => task.completed);
        }

        // Prepare the $set object for updating fields
        const updateFields = {
            'timeBlocks.$.name': name,
            'timeBlocks.$.startTime': startTime,
            'timeBlocks.$.endTime': endTime,
            'timeBlocks.$.tasks': tasks,
            'timeBlocks.$.category': category,
            'timeBlocks.$.completed': allTasksCompleted || completed,
            'timeBlocks.$.timerDuration': timerDuration,
        };

        const schedule = await DailySchedule.findOneAndUpdate(
            { userId: req.user._id, date: today, 'timeBlocks._id': blockId },
            { $set: updateFields },
            { new: true }
        );

        if (schedule) {
            // Find the updated time block in the schedule
            const updatedBlock = schedule.timeBlocks.find(block => block._id.toString() === blockId);

            // If the time block is marked as completed, calculate and add coins
            if (updatedBlock.completed) {
                let coins = 0;
                if (category === 'work' || category === 'leisure') {
                    const durationInHours = timerDuration / 3600; // Convert seconds to hours

                    if (durationInHours <= 1) {
                        coins = 2;
                    } else if (durationInHours <= 3) {
                        coins = 4;
                    } else {
                        coins = 6;
                    }
                }

                // Efficiently increment the user's coin balance
                await User.findByIdAndUpdate(req.user._id, { $inc: { coins } });
            }

            res.json(updatedBlock);
        } else {
            res.status(404).json({ message: 'Time block not found' });
        }
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Deletes a specific time block from the daily schedule for the current date, including associated tasks.
 * @param {Request} req - The request object, including time block ID.
 * @param {Response} res - The response object used to confirm deletion.
 */
export const deleteTimeBlock = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { blockId } = req.params;

    try {
        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        if (schedule) {
            const block = schedule.timeBlocks.id(blockId);
            if (block) {
                // Remove associated tasks
                await Task.deleteMany({ timeBlockId: blockId });

                schedule.timeBlocks.pull(blockId);
                await schedule.save();
                res.status(204).send(); // No content to send back
            } else {
                res.status(404).json({ message: 'Time block not found' });
            }
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

/**
 * Retrieves the total hours spent in each category for a specific week and the user's weekly hour requirements.
 * @param {Request} req - The request object, including the user ID and a date within the week.
 * @param {Response} res - The response object used to return the total hours by category and user preferences.
 */
export const getWeeklyMetrics = async (req, res, next) => {
    const userId = req.user._id;
    const date = req.query.date;

    // Calculate start and end dates of the week for the given date
    const startDate = startOfWeek(new Date(date));
    const endDate = endOfWeek(new Date(date));

    try {
        // Fetch user preferences from the User model
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const preferences = user.preferences;
        if (!preferences) {
            return res.status(404).json({ message: 'User preferences not found' });
        }

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

        res.json({
            preferences,
            categoryHours
        });
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};
