import mongoose from 'mongoose';
import Goal from '../models/goal.js';
import Habit from '../models/habit.js';
import User from '../models/user.js';
import { DailySchedule } from '../models/dailySchedule.js';

const startOfWeek = (date) => {
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const endOfWeek = (date) => {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return result;
};

export const calculateMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user preferences with lean query
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startDate = startOfWeek(new Date());
    const endDate = endOfWeek(new Date());

    // Aggregate Planned Time vs. Realized Time
    const plannedVsRealizedTimeData = await DailySchedule.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
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
      date: data._id,
      planned: data.planned / 3600, // Convert to hours
      realized: data.actual / 3600, // Convert to hours
    }));

    // Aggregate Average Time Block Efficiency
    const timeBlockEfficiencyData = await DailySchedule.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$timeBlocks' },
    {
        $project: {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
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


    const averageTimeBlockEfficiency = timeBlockEfficiencyData.map(data => ({
      date: data._id,
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
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
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
      activeStreaks,
      categoryHours,
    });
  } catch (error) {
    next(error);
  }
};
