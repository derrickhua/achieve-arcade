import { nextDay } from 'date-fns';
import { DailySchedule } from '../models/dailySchedule.js';
import Goal from '../models/goal.js';
import Habit from '../models/habit.js';

// Helper function to aggregate metrics
export const calculateMetrics = async (req, res, next) => {
    try {
        console.log('Starting metrics calculation...');
      
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
      
        // Aggregate Overall Task Completion Rate
        console.time('Overall Task Completion Rate');
        const taskCompletionData = await DailySchedule.aggregate([
          { $unwind: '$timeBlocks' },
          { $unwind: '$timeBlocks.tasks' },
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: { $sum: { $cond: ['$timeBlocks.tasks.completed', 1, 0] } },
            },
          },
        ]);
        console.timeEnd('Overall Task Completion Rate');
        console.log('Task Completion Data:', taskCompletionData);
        const taskCompletionRate = taskCompletionData.length
          ? (taskCompletionData[0].completedTasks / taskCompletionData[0].totalTasks) * 100
          : 0;
        console.log('Task Completion Rate:', taskCompletionRate);
      
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
              (scheduleCompletionData[0].totalTimeBlocks + scheduleCompletionData[0].totalTasks)) *
            100
          : 0;
        console.log('Schedule Completion Rate:', scheduleCompletionRate);
      
        // Aggregate Time Block Efficiency
        console.time('Time Block Efficiency');
        const timeBlockEfficiencyData = await DailySchedule.aggregate([
          { $unwind: '$timeBlocks' },
          {
            $project: {
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
              _id: null,
              averageEfficiency: { $avg: '$efficiency' },
            },
          },
        ]);
        console.timeEnd('Time Block Efficiency');
        console.log('Time Block Efficiency Data:', timeBlockEfficiencyData);
        const averageTimeBlockEfficiency = timeBlockEfficiencyData.length
          ? timeBlockEfficiencyData[0].averageEfficiency
          : 0;
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
      
        // Aggregate Habit Adherence Rate
        console.time('Habit Adherence Rate');
        const habitAdherenceData = await Habit.aggregate([
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
        console.timeEnd('Habit Adherence Rate');
        console.log('Habit Adherence Data:', habitAdherenceData);
        const habitAdherenceRate = habitAdherenceData.length
          ? (habitAdherenceData[0].consistentPeriods / habitAdherenceData[0].totalPeriods) * 100
          : 0;
        console.log('Habit Adherence Rate:', habitAdherenceRate);
      
        console.log('Metrics calculation completed.');
      
        // Return calculated metrics
        res.json({
            timeData,
            taskCompletionRate,
            scheduleCompletionRate,
            averageTimeBlockEfficiency,
            goalProgress,
            milestoneCompletionRate,
            activeStreaks,
            habitAdherenceRate,
          })

    } catch (error) {
        next(error)
    }
};
