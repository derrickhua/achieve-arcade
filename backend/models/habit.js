import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  habitPeriod: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true
  },
  occurrences: [{
    date: { type: Date, required: true },
    completions: { type: Number, default: 0 } // Tracks the number of completions per day
  }],
  consistencyGoals: [{
    goal: { type: Number, required: true },
    effectiveDate: { type: Date, required: true }
  }],
  latestGoal: {
    goal: { type: Number, default: 0 },
    effectiveDate: { type: Date }
  },
  completionDates: [{ type: Date }],
  streak: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Add indexes
HabitSchema.index({ user: 1 });
HabitSchema.index({ "occurrences.date": 1 });

/**
 * Updates the goal for this habit instance and ensures the latest goal is updated.
 * @param {Number} newGoal - The new goal value to set.
 * @param {Date} effectiveDate - The date from which this goal becomes effective.
 * @returns {Promise<Object>} A promise that resolves with the operation result.
 */
HabitSchema.methods.updateGoal = async function(newGoal, effectiveDate) {
  if (!newGoal || newGoal <= 0) {
      const error = new Error("Invalid goal: Goal must be a positive number.");
      error.status = 400;
      throw error;
  }
  if (!effectiveDate || new Date(effectiveDate) < new Date()) {
      const error = new Error("Invalid effective date: Date must be today or in the future.");
      error.status = 400;
      throw error;
  }

  const goalEntry = { goal: newGoal, effectiveDate: new Date(effectiveDate) };
  if (this.latestGoal.effectiveDate && new Date(goalEntry.effectiveDate) <= new Date(this.latestGoal.effectiveDate)) {
      const error = new Error("Effective date must be later than the date of the latest goal.");
      error.status = 400;
      throw error;
  }

  this.consistencyGoals.push(goalEntry);
  this.consistencyGoals.sort((a, b) => b.effectiveDate - a.effectiveDate);
  this.latestGoal = { goal: newGoal, effectiveDate: goalEntry.effectiveDate };

  try {
      await this.save();
  } catch (error) {
      console.error("Failed to save the habit with updated goals:", error);
      throw new Error("Database error when updating goal: " + error.message);
  }
};



/**
 * Calculates the current streak based on consecutive periods meeting the habit's goals.
 * Uses MongoDB aggregation to efficiently compute streak over potentially large datasets.
 * @returns {Promise<Number>} A promise that resolves with the current streak value.
 */
HabitSchema.methods.calculateStreak = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pipeline = [
      { $match: { _id: this._id } },
      { $unwind: "$occurrences" },
      { $sort: { "occurrences.date": -1 } },
      { $project: {
          date: "$occurrences.date",
          completions: "$occurrences.completions",
          year: { $year: "$occurrences.date" },
          month: { $month: "$occurrences.date" },
          day: { $dayOfMonth: "$occurrences.date" },
          week: { $isoWeek: "$occurrences.date" } // ISO week starts on Monday
      }},
      {
          $group: {
              _id: {
                  // Conditional grouping based on habitPeriod
                  $cond: {
                      if: { $eq: ["$habitPeriod", "Daily"] },
                      then: { day: "$day", month: "$month", year: "$year" },
                      else: {
                          $cond: {
                              if: { $eq: ["$habitPeriod", "Weekly"] },
                              then: { week: "$week", year: "$year" },
                              else: { month: "$month", year: "$year" } // Monthly grouping
                          }
                      }
                  }
              },
              completions: { $sum: "$completions" },
              lastDate: { $max: "$date" }
          }
      },
      {
          $match: {
              completions: { $gte: this.latestGoal.goal } // Assuming a method to fetch the latest goal
          }
      },
      {
          $sort: { "_id.lastDate": -1 }
      },
      {
          $group: {
              _id: null,
              streak: { $sum: 1 } // Counting consecutive periods meeting the goal
          }
      }
  ];

  const result = await this.model('Habit').aggregate(pipeline);
  return result.length > 0 ? result[0].streak : 0;
};

/**
 * Increments the completion count for a given date. If no occurrence exists for that date,
 * it creates a new one. It also increments the streak counter.
 * @param {Date} date - The date on which to increment the completion.
 * @returns {Promise<Object>} A promise that resolves with the operation result.
 */
HabitSchema.methods.incrementCompletion = async function(date) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0); // Normalize the date for consistent comparison

  let occurrence = this.occurrences.find(o => {
      const occurrenceDate = new Date(o.date);
      occurrenceDate.setHours(0, 0, 0, 0);
      return occurrenceDate.getTime() === targetDate.getTime();
  });

  if (occurrence) {
      // Increment the completions
      occurrence.completions += 1;
  } else {
      // Add a new occurrence for this date with initial completions set to 1
      this.occurrences.push({
          date: targetDate,
          completions: 1
      });
  }

  this.streak += 1;

  try {
      await this.save();
      return { success: true, message: "Completions and streak updated successfully." };
  } catch (error) {
      return { success: false, message: "Error updating completions and streak: " + error.message };
  }
};

/**
 * Retrieves all occurrences of this habit within the current week.
 * This method calculates the start and end of the current week and filters occurrences accordingly.
 * @returns {Array<Object>} An array of occurrences within the current week.
 */
HabitSchema.methods.getWeeklyOccurrences = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
  const startOfWeek = new Date(today.setDate(today.getDate() + diffToMonday));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  if (!this.occurrences || this.occurrences.length === 0) {
      return []; // Return an empty array if there are no occurrences
  }

  // Filter occurrences to find those within the current week
  const weeklyOccurrences = this.occurrences.filter(occurrence => {
      const occurrenceDate = new Date(occurrence.date);
      occurrenceDate.setHours(0, 0, 0, 0);
      return occurrenceDate >= startOfWeek && occurrenceDate <= endOfWeek;
  });

  return weeklyOccurrences;
};

/**
 * Generates data for a heatmap visualization of habit completions over the last 30 days.
 * This method aggregates completions and ensures each day within the last 30 days is represented.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of daily completions data.
 */
HabitSchema.methods.getHeatmapData = async function() {
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 29); // Last 30 days
  startDate.setHours(0, 0, 0, 0);

  const occurrences = await this.model('Habit').aggregate([
      { $match: { _id: this._id } },
      { $unwind: "$occurrences" },
      { $match: {
          "occurrences.date": { $gte: startDate, $lte: endDate }
      }},
      { $group: {
          _id: "$occurrences.date",
          completions: { $sum: "$occurrences.completions" }
      }},
      { $sort: { _id: 1 } }
  ]);

  // Create a map of occurrences for quick lookup
  const occurrenceMap = {};
  occurrences.forEach(occ => {
      occurrenceMap[occ._id.toISOString().split('T')[0]] = occ.completions;
  });

  // Fill in the gaps
  const heatmapData = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      heatmapData.push({
          date: dateKey,
          completions: occurrenceMap[dateKey] || 0
      });
  }

  return heatmapData;
};

/**
 * Calculates the performance rate of the habit over a specified duration ('monthly' or 'all-time').
 * This method aggregates completion data over the selected period and computes the consistency rate.
 * @param {String} duration - The duration over which to calculate the rate ('monthly' or 'all-time').
 * @returns {Promise<Object>} A promise that resolves with details of the performance rate.
 */
HabitSchema.methods.calculatePerformanceRate = async function(duration = 'monthly') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Ensure the comparison is strictly date-based.
  let startDate, aggregationPipeline;

  if (duration === 'all-time') {
      // Set startDate to the earliest date in occurrences or a default.
      startDate = new Date(); // Default to today and adjust below.
  } else { // Default to monthly
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  aggregationPipeline = [
      { $match: { _id: this._id } },
      { $unwind: "$occurrences" },
      { $match: { "occurrences.date": { $gte: startDate, $lte: today } } },
      { $group: {
          _id: null,
          totalCompletions: { $sum: "$occurrences.completions" },
          count: { $sum: 1 }  // Count the number of occurrences
      }}
  ];

  // If calculating for 'all-time', dynamically find the earliest date in occurrences.
  if (duration === 'all-time') {
      aggregationPipeline.unshift(
          { $group: {
              _id: null,
              earliestDate: { $min: "$occurrences.date" }
          }},
          { $addFields: {
              startDate: "$earliestDate"
          }}
      );
      aggregationPipeline.push(
          { $addFields: {
              startDate: { $ifNull: ["$startDate", today] }  // Use today if no occurrences exist.
          }}
      );
  }

  const result = await this.model('Habit').aggregate(aggregationPipeline).exec();
  
  // Handle the result after aggregation
  if (result.length > 0 && result[0].totalCompletions !== undefined) {
      const totalCompletions = result[0].totalCompletions;
      const totalPossibleCompletions = this.latestGoal.goal * (duration === 'all-time' ? 
          Math.ceil((today - result[0].startDate) / (7 * 24 * 60 * 60 * 1000)) : 
          Math.ceil((new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) / 7));

      const consistencyRate = (totalCompletions / totalPossibleCompletions) * 100;
      return {
          consistencyRate: Math.min(consistencyRate, 100),  // Cap at 100%
          totalCompletions,
          totalPossibleCompletions
      };
  } else {
      return {
          consistencyRate: 0,
          totalCompletions: 0,
          totalPossibleCompletions: 0
      };
  }
};

const Habit = mongoose.model('Habit', HabitSchema);

export default Habit;
