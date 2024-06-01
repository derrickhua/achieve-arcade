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
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },
    habitTotal: {
      type: Number,
      default: 0
    },
    habitPeriod: {
      type: String,
      enum: ['Daily', 'Weekly'],
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
  
    const lastGoal = this.consistencyGoals[this.consistencyGoals.length - 1];
  
    const pipeline = [
      { $match: { _id: this._id } },
      { $unwind: "$occurrences" },
      { $sort: { "occurrences.date": 1 } },
      { $addFields: {
        period: {
          $cond: {
            if: { $eq: ["$habitPeriod", "Daily"] },
            then: { $dateToString: { format: "%Y-%m-%d", date: "$occurrences.date" } },
            else: {
              $cond: {
                if: { $eq: ["$habitPeriod", "Weekly"] },
                then: { $concat: [{ $toString: { $isoWeek: "$occurrences.date" } }, "-", { $toString: { $year: "$occurrences.date" } }] },
                else: { $dateToString: { format: "%Y-%m", date: "$occurrences.date" } } // Monthly (future-proofing)
              }
            }
          }
        }
      }},
      { $group: {
        _id: "$period",
        completions: { $sum: "$occurrences.completions" }
      }},
      { $match: {
        completions: { $gte: lastGoal.goal }
      }},
      { $sort: { "_id": 1 } },
      { $group: {
        _id: null,
        streak: {
          $sum: 1
        }
      }}
    ];
  
    const result = await this.model('Habit').aggregate(pipeline);
    return result.length > 0 ? result[0].streak : 0;
};

/**
 * Sets the completion count for a given date. If no occurrence exists for that date,
 * it creates a new one. If occurrence exists, it sets the completions to the specified count.
 * @param {Date} date - The date on which to change the completion.
 * @param {number} change - The new completion count to set.
 * @returns {Promise<Object>} A promise that resolves with the operation result.
 */
HabitSchema.methods.changeCompletion = async function(date, change) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Normalize the date for consistent comparison
  
    let occurrence = this.occurrences.find(o => {
      const occurrenceDate = new Date(o.date);
      occurrenceDate.setHours(0, 0, 0, 0);
      return occurrenceDate.getTime() === targetDate.getTime();
    });
  
    let previousCompletions = 0;
    if (occurrence) {
      previousCompletions = occurrence.completions;
      occurrence.completions = Math.max(0, change);
    } else {
      this.occurrences.push({ date: targetDate, completions: Math.max(0, change) });
    }
  
    const increment = Math.max(0, change - previousCompletions);
  
    if (increment > 0) {
      let coins = 0;
      if (this.difficulty === 'Easy') {
        coins = 1 * increment;
      } else if (this.difficulty === 'Medium') {
        coins = 2 * increment;
      } else if (this.difficulty === 'Hard') {
        coins = 3 * increment;
      }
  
      await mongoose.model('User').findByIdAndUpdate(this.user, { $inc: { coins } });
    }
  
    await this.save();
    return { success: true, message: "Completions updated successfully and coins awarded." };
  };

/**
* Retrieves all occurrences of this habit within the current week.
* This method calculates the start and end of the current week and filters occurrences accordingly.
* If there are no recorded occurrences for a particular day, it returns a default object with zero completions.
* @returns {Array<Object>} An array of occurrences within the current week, including days with zero completions.
*/
HabitSchema.methods.getWeeklyOccurrences = function() {
 const today = new Date();
 today.setHours(0, 0, 0, 0); // Reset time part

 const dayOfWeek = today.getDay();
 const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
 const startOfWeek = new Date(today.setDate(today.getDate() + diffToMonday));
 const endOfWeek = new Date(startOfWeek);
 endOfWeek.setDate(endOfWeek.getDate() + 6);

 const daysInWeek = Array.from({ length: 7 }).map((_, i) => {
   const date = new Date(startOfWeek);
   date.setDate(date.getDate() + i);
   return { date, completions: 0 }; // Default object structure
 });

 if (!this.occurrences || this.occurrences.length === 0) {
     return daysInWeek; // Return the default week if there are no occurrences
 }

 // Map occurrences to days of the week
 return daysInWeek.map(day => {
   const found = this.occurrences.find(occurrence => {
     const occurrenceDate = new Date(occurrence.date);
     occurrenceDate.setHours(0, 0, 0, 0);
     return occurrenceDate.getTime() === day.date.getTime();
   });
   if (found) {
     return { ...day, completions: found.completions };
   }
   return day;
 });
};

/**
 * Generates data for a heatmap visualization of habit completions over the current month and the two previous months.
 * This method aggregates completions and ensures each day within these three months is represented,
 * providing a sliding window of data as time progresses.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of daily completions data.
 */
HabitSchema.methods.getHeatmapData = async function() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Set start date to the first day of the month, two months prior to the current month
    const startDate = new Date(currentYear, currentMonth - 2, 1);
    startDate.setHours(0, 0, 0, 0);

    // Set end date to the last day of the current month
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const occurrences = await this.model('Habit').aggregate([
        { $match: { _id: this._id } },
        { $unwind: "$occurrences" },
        { $match: {
            "occurrences.date": { $gte: startDate, $lte: endDate }
        }},
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$occurrences.date" } },
            completions: { $sum: "$occurrences.completions" }
        }},
        { $sort: { _id: 1 } }
    ]);

    // Map occurrences to ensure every day is represented in the heatmap
    const occurrenceMap = {};
    occurrences.forEach(occ => {
        occurrenceMap[occ._id] = occ.completions;
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
  

const Habit = mongoose.model('Habit', HabitSchema);

export default Habit;
