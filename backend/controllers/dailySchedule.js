import { startOfWeek, endOfWeek } from 'date-fns';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import Task from '../models/task.js';
import { TimeBlock, DailySchedule } from '../models/dailySchedule.js';
import User from '../models/user.js';


/**
 * Retrieves the daily schedule for the user for the current date.
 * If no schedule exists for the current date, a new one is created.
 * Also retrieves tasks associated with today's time blocks.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the daily schedule.
 */
export const getDailySchedule = async (req, res, next) => {
    try {
        const { date, timezone } = req.query; // Get the date and timezone from the query parameters

        if (!date || !timezone) {
            const error = new Error('Date and timezone must be provided');
            error.status = 400; // Bad Request
            return next(error);
        }

        // Create a moment object using the provided date and timezone
        const localDateTime = moment.tz(date, timezone).startOf('day');
        const utcDate = localDateTime.clone().utc().toDate();

        let schedule = await DailySchedule.findOne({ userId: req.user._id, date: utcDate }).populate('timeBlocks.tasks');
        if (!schedule) {
            schedule = new DailySchedule({ userId: req.user._id, date: utcDate, timeBlocks: [] });
            await schedule.save();
        }

        res.json(schedule);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};


/**
 * Updates the notes for the daily schedule for the current date.
 * @param {Request} req - The request object, including the new notes.
 * @param {Response} res - The response object used to return the updated schedule.
 */
export const updateNotes = async (req, res, next) => {
    const { notes, timezone } = req.body;

    if (typeof notes !== 'string' || !timezone) {
        const error = new Error('Notes must be a string and timezone must be provided');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        const localDateTime = moment().tz(timezone).startOf('day');
        const utcDate = localDateTime.clone().utc().toDate();

        const schedule = await DailySchedule.findOneAndUpdate(
            { userId: req.user._id, date: utcDate },
            { $set: { notes } },
            { new: true }
        );

        if (schedule) {
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
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
    const { name, startTime, endTime, tasks, category, timezone } = req.body;

    if (!name || !startTime || !endTime || !category || !timezone) {
        const error = new Error('Name, start time, end time, category, and timezone must be provided');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        // Parse start and end times with the provided timezone
        const parsedStartTime = moment.tz(startTime, timezone).utc().toDate();
        const parsedEndTime = moment.tz(endTime, timezone).utc().toDate();

        // Get the current date in the user's timezone
        const today = moment().tz(timezone).startOf('day').utc().toDate();

        // Find or create the daily schedule for today
        let schedule = await DailySchedule.findOne({ userId: req.user._id, date: today });
        if (!schedule) {
            schedule = new DailySchedule({ userId: req.user._id, date: today, timeBlocks: [] });
        }

        // Create new Task documents if tasks are provided
        let taskDocs = [];
        if (tasks && tasks.length > 0) {
            taskDocs = await Task.insertMany(
                tasks.map(task => ({
                    name: task.name,
                    difficulty: task.difficulty,
                    userId: req.user._id,
                    timeBlockId: null
                }))
            );
        }

        // Create new TimeBlock document
        const timeBlock = new TimeBlock({
            name,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            tasks: taskDocs.map(task => task._id),
            category,
            userId: req.user._id,
        });

        // Update tasks to link them to this time block
        if (taskDocs.length > 0) {
            await Task.updateMany(
                { _id: { $in: taskDocs.map(task => task._id) } },
                { timeBlockId: timeBlock._id }
            );
        }

        // Add the new time block to the schedule and save
        schedule.timeBlocks.push(timeBlock);
        await timeBlock.save();
        await schedule.save();

        await schedule.populate('timeBlocks.tasks');

        res.json(schedule);
    } catch (error) {
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

export const updateTimeBlock = async (req, res, next) => {
    const { blockId } = req.params;
    const { name, startTime, endTime, tasks, category, completed, timerDuration, timezone } = req.body;

    if (!timezone) {
        const error = new Error('Timezone must be provided');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        const today = moment().tz(timezone).startOf('day').utc().toDate();

        // Filter out tasks with temporary IDs and tasks with valid ObjectIds
        const existingTasks = tasks.filter(task => mongoose.Types.ObjectId.isValid(task._id));
        const newTasks = tasks.filter(task => !mongoose.Types.ObjectId.isValid(task._id));

        // Create new Task documents if new tasks are provided
        let newTaskDocs = [];
        if (newTasks.length > 0) {
            newTaskDocs = await Task.insertMany(
                newTasks.map(task => ({
                    name: task.name,
                    difficulty: task.difficulty,
                    userId: req.user._id,
                    timeBlockId: blockId
                }))
            );
        }

        // Update existing tasks
        if (existingTasks.length > 0) {
            for (let task of existingTasks) {
                await Task.findByIdAndUpdate(task._id, {
                    name: task.name,
                    difficulty: task.difficulty,
                    completed: task.completed
                });
            }
        }

        // Prepare the list of task IDs to retain in the time block
        const allTaskIds = existingTasks.map(task => task._id).concat(newTaskDocs.map(task => task._id));

        // Check if all tasks are completed if there are any tasks
        let allTasksCompleted = allTaskIds.length > 0
            ? (await Task.find({ _id: { $in: allTaskIds }, userId: req.user._id }, 'completed')).every(task => task.completed)
            : completed;

        // If new tasks are added or existing tasks are updated, set completed to false
        const shouldSetIncomplete = newTasks.length > 0 || !allTasksCompleted;

        // Prepare the $set object for updating fields in both DailySchedule and TimeBlock
        const updateFields = {
            name,
            startTime: moment.tz(startTime, timezone).utc().toDate(),
            endTime: moment.tz(endTime, timezone).utc().toDate(),
            tasks: allTaskIds,
            category,
            timerDuration,
        };

        // Update the TimeBlock document without the completed field
        const updatedTimeBlock = await TimeBlock.findByIdAndUpdate(
            blockId,
            updateFields,
            { new: true }
        ).populate('tasks');

        // Update the DailySchedule document
        const scheduleUpdateResult = await DailySchedule.findOneAndUpdate(
            { userId: req.user._id, date: today, 'timeBlocks._id': blockId },
            { $set: { 'timeBlocks.$': updatedTimeBlock } },
            { new: true }
        ).populate('timeBlocks.tasks');

        if (scheduleUpdateResult) {
            // If the time block should be completed
            if (!shouldSetIncomplete) {
                try {
                    await updatedTimeBlock.completeTimeBlock();
                } catch (error) {
                    console.error(`Error completing time block: ${error.message}`);
                }
            } else {
                // If the time block should be incomplete
                try {
                    await updatedTimeBlock.incompleteTimeBlock();
                } catch (error) {
                    console.error(`Error incompleting time block: ${error.message}`);
                }
            }

            res.json(updatedTimeBlock);
        } else {
            res.status(404).json({ message: 'Time block not found in daily schedule' });
        }
    } catch (error) {
        console.error(`Error updating time block: ${error.message}`);
        next(error); // Pass any server-side errors to the error handling middleware
    }
};

export const deleteTimeBlock = async (req, res, next) => {
    const { blockId } = req.params;
    const { timezone } = req.body; // Get the timezone from the request body

    if (!timezone) {
        const error = new Error('Timezone must be provided');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        console.log(`Attempting to delete time block with ID: ${blockId}, Timezone: ${timezone}`);

        // Get the current date in the user's timezone
        const localDateTime = moment().tz(timezone).startOf('day');
        const utcDate = localDateTime.clone().utc().toDate();

        const schedule = await DailySchedule.findOne({ userId: req.user._id, date: utcDate });
        if (schedule) {
            const block = schedule.timeBlocks.id(blockId);
            if (block) {
                // Remove associated tasks
                await Task.deleteMany({ timeBlockId: blockId });

                schedule.timeBlocks.pull(blockId);
                await schedule.save();
                console.log('Time block deleted successfully');
                res.status(204).send(); // No content to send back
            } else {
                console.log('Time block not found');
                res.status(404).json({ message: 'Time block not found' });
            }
        } else {
            console.log('Schedule not found');
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        console.error(`Error deleting time block: ${error.message}`);
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
    const { date, timezone } = req.query;

    if (!date || !timezone) {
        const error = new Error('Date and timezone must be provided');
        error.status = 400; // Bad Request
        return next(error);
    }

    // Calculate start and end dates of the week for the given date
    const startDate = moment.tz(date, timezone).startOf('week').utc().toDate();
    const endDate = moment.tz(date, timezone).endOf('week').utc().toDate();

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
        console.error('Error in getWeeklyMetrics:', error);
        next(error); // Pass any server-side errors to the error handling middleware
    }
};