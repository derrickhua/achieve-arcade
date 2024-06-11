import mongoose from 'mongoose';
import Goal from '../models/goal.js';
import Habit from '../models/habit.js';
import User from '../models/user.js';
import { DailySchedule } from '../models/dailySchedule.js';
import Task from '../models/task.js';

export const calculateMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user preferences with lean query
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Aggregate Planned Time vs. Realized Time
    const plannedVsRealizedTimeData = await DailySchedule.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$timeBlocks' },
      {
        $group: {
          _id: '$date',
          planned: {
            $sum: {
              $divide: [{ $subtract: ['$timeBlocks.endTime', '$timeBlocks.startTime'] }, 1000],
            },
          },
          actual: { $sum: '$timeBlocks.timerDuration' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const plannedVsRealizedTime = plannedVsRealizedTimeData.map(data => ({
      date: new Date(data._id).toISOString(),
      planned: data.planned / 3600, // Convert to hours
      realized: data.actual / 3600, // Convert to hours
    }));

    // Tasks completed
    const totalTasksCompleted = await Task.countDocuments({ userId: new mongoose.Types.ObjectId(userId), completed: true });

    // Aggregate Average Time Block Efficiency
    const timeBlockEfficiencyData = await DailySchedule.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$timeBlocks' },
      {
        $lookup: {
          from: 'tasks',
          localField: 'timeBlocks.tasks',
          foreignField: '_id',
          as: 'taskDetails'
        }
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          efficiency: {
            $cond: [
              { $eq: [{ $size: '$timeBlocks.tasks' }, 0] },
              { $cond: [{ $eq: ['$timeBlocks.completed', true] }, 100, 0] }, // If no tasks, 100% if completed, 0% otherwise
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $size: {
                          $filter: {
                            input: '$taskDetails',
                            as: 'task',
                            cond: { $eq: ['$$task.completed', true] },
                          },
                        },
                      },
                      { $size: '$taskDetails' },
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

    const averageTimeBlockEfficiency = timeBlockEfficiencyData.map(data => ({
      date: new Date(data._id).toISOString(),
      efficiency: data.averageEfficiency,
    }));

    // Aggregate Goals Achieved
    const goalProgressData = await Goal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalGoals: { $sum: 1 },
          completedGoals: { $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } },
        },
      },
    ]);

    const goalsAchieved = goalProgressData.length ? goalProgressData[0].completedGoals : 0;

    // Aggregate Milestones Completed
    const milestoneCompletionData = await Goal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$milestones' },
      {
        $group: {
          _id: null,
          totalMilestones: { $sum: 1 },
          completedMilestones: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$milestones.completed', true] }, { $lte: ['$milestones.completionDate', '$milestones.deadline'] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const milestonesCompleted = milestoneCompletionData.length ? milestoneCompletionData[0].completedMilestones : 0;

    // Aggregate Number of Habits with Active Streaks
    const activeStreaks = await Habit.countDocuments({ user: new mongoose.Types.ObjectId(userId), streak: { $gt: 0 } });

    const weeklyHoursData = await DailySchedule.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$timeBlocks' },
      {
        $group: {
          _id: '$timeBlocks.category',
          totalDuration: { $sum: '$timeBlocks.timerDuration' },
        },
      },
    ]);

    const categoryHours = {
      work: 0,
      leisure: 0,
      family_friends: 0,
      atelic: 0,
    };

    for (const item of weeklyHoursData) {
      categoryHours[item._id] = item.totalDuration / 3600; // Convert seconds to hours
    }

    // Return calculated metrics
    res.json({
      plannedVsRealizedTime,
      averageTimeBlockEfficiency,
      goalsAchieved,
      milestonesCompleted,
      totalTasksCompleted,
      activeStreaks,
      categoryHours,
    });
  } catch (error) {
    next(error);
  }
};
