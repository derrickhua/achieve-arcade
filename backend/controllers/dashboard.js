import mongoose from 'mongoose';
import { startOfWeek, endOfWeek } from 'date-fns';
import { DailySchedule } from '../models/dailySchedule.js';
import Goal from '../models/goal.js';
import Habit from '../models/habit.js';
import User from '../models/user.js';

// Helper function to aggregate metrics
export const calculateMetrics = async (req, res, next) => {
    try {
        console.log('Starting metrics calculation...');
      
        const userId = req.user._id;

        // Fetch user preferences with lean query
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { preferences: weeklyRequirements } = user;

        // Aggregate Total Time Spent vs. Planned Time
        console.time('Total Time Spent vs. Planned Time');
        const timeData = await DailySchedule.aggregate([
            { $unwind: '$timeBlocks' },
            {
                $group: {
                    _id: '$date',
                    planned: {
                        $sum: {
                            $divide: [
                                { $subtract: ['$timeBlocks.endTime', '$timeBlocks.startTime'] },
                                1000,
                            ],
                        },
                    },
                    actual: { $sum: '$timeBlocks.timerDuration' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        console.timeEnd('Total Time Spent vs. Planned Time');
        console.log('Time Data:', timeData);
      
        // Aggregate Daily Schedule Completion Rate
        console.time('Daily Schedule Completion Rate');
        const scheduleCompletionData = await DailySchedule.aggregate([
            { $unwind: '$timeBlocks' },
            {
                $group: {
                    _id: null,
                    totalTimeBlocks: { $sum: 1 },
                    completedTimeBlocks: { $sum: { $cond: ['$timeBlocks.completed', 1, 0] } },
                    totalTasks: { $sum: { $size: '$timeBlocks.tasks' } },
                    completedTasks: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$timeBlocks.tasks',
                                    as: 'task',
                                    cond: { $eq: ['$$task.completed', true] },
                                },
                            },
                        },
                    },
                },
            },
        ]);
        console.timeEnd('Daily Schedule Completion Rate');
        console.log('Schedule Completion Data:', scheduleCompletionData);
        const scheduleCompletionRate = scheduleCompletionData.length
            ? ((scheduleCompletionData[0].completedTimeBlocks + scheduleCompletionData[0].completedTasks) /
                (scheduleCompletionData[0].totalTimeBlocks + scheduleCompletionData[0].totalTasks)) * 100
            : 0;
        console.log('Schedule Completion Rate:', scheduleCompletionRate);
      
        // Aggregate Time Block Efficiency
        console.time('Time Block Efficiency');
        const timeBlockEfficiencyData = await DailySchedule.aggregate([
            { $unwind: '$timeBlocks' },
            {
                $project: {
                    date: '$date',
                    efficiency: {
                        $cond: [
                            { $eq: [{ $size: '$timeBlocks.tasks' }, 0] },
                            0,
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: '$timeBlocks.tasks',
                                                        as: 'task',
                                                        cond: { $eq: ['$$task.completed', true] },
                                                    },
                                                },
                                            },
                                            { $size: '$timeBlocks.tasks' },
                                        ],
                                    },
                                    100,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: '$date',
                    averageEfficiency: { $avg: '$efficiency' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        console.timeEnd('Time Block Efficiency');
        console.log('Time Block Efficiency Data:', timeBlockEfficiencyData);
        const averageTimeBlockEfficiency = timeBlockEfficiencyData.length
            ? timeBlockEfficiencyData
            : [];
        console.log('Average Time Block Efficiency:', averageTimeBlockEfficiency);
        // Aggregate Goal Progress
        console.time('Goal Progress');
        const goalProgressData = await Goal.aggregate([
            { $unwind: '$milestones' },
            {
                $group: {
                    _id: null,
                    totalMilestones: { $sum: 1 },
                    completedMilestones: { $sum: { $cond: ['$milestones.completed', 1, 0] } },
                },
            },
        ]);
        console.timeEnd('Goal Progress');
        console.log('Goal Progress Data:', goalProgressData);
        const goalProgress = goalProgressData.length
            ? (goalProgressData[0].completedMilestones / goalProgressData[0].totalMilestones) * 100
            : 0;
        console.log('Goal Progress:', goalProgress);
      
        // Aggregate Milestone Completion Rate
        console.time('Milestone Completion Rate');
        const milestoneCompletionRate = goalProgress; // Same as goal progress
        console.timeEnd('Milestone Completion Rate');
        console.log('Milestone Completion Rate:', milestoneCompletionRate);
      
        // Aggregate Number of Habits with Active Streaks
        console.time('Active Streaks');
        const activeStreaks = await Habit.countDocuments({ streak: { $gt: 0 } });
        console.timeEnd('Active Streaks');
        console.log('Active Streaks:', activeStreaks);
      
        // Aggregate Habit Consistency Rate
        console.time('Habit Consistency Rate');
        const habitConsistencyData = await Habit.aggregate([
            { $unwind: '$occurrences' },
            {
                $group: {
                    _id: null,
                    totalPeriods: { $sum: 1 },
                    consistentPeriods: {
                        $sum: {
                            $cond: [{ $gte: ['$occurrences.completions', '$latestGoal.goal'] }, 1, 0],
                        },
                    },
                },
            },
        ]);
        console.timeEnd('Habit Consistency Rate');
        console.log('Habit Consistency Data:', habitConsistencyData);
        const habitConsistencyRate = habitConsistencyData.length
            ? (habitConsistencyData[0].consistentPeriods / habitConsistencyData[0].totalPeriods) * 100
            : 0;
        console.log('Habit Consistency Rate:', habitConsistencyRate);
      
        // Aggregate Weekly Hours by Category
        console.time('Weekly Hours by Category');
        const date = new Date();
        const startDate = startOfWeek(date);
        const endDate = endOfWeek(date);

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
        console.timeEnd('Weekly Hours by Category');
        console.log('Category Hours:', categoryHours);
      
        console.log('Metrics calculation completed.');
        

        // Return calculated metrics
        res.json({
            timeData,
            scheduleCompletionRate,
            averageTimeBlockEfficiency,
            goalProgress,
            milestoneCompletionRate,
            activeStreaks,
            habitConsistencyRate,
            categoryHours,
            weeklyRequirements
        });

    } catch (error) {
        next(error)
    }
};
