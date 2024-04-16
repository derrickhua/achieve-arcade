import Habit from "./models/habit.js";
import User from "./models/user.js";
import moment from "moment-timezone";

export const defineAndScheduleJobs = async (agenda) => {
    // Define the job
    agenda.define('calculate streaks', async job => {
      const userId = job.attrs.data.userId;
  
      // Get all habits for this user
      const habits = await Habit.find({ user: userId });
  
      // For each habit
      for (const habit of habits) {
        // Calculate the streak
        const streak = await habit.calculateStreak();
  
        // Here you can do something with the calculated streak
        console.log(`Streak for habit ${habit._id} of user ${userId}: ${streak}`);
      }
    });
  
    // Get all users
    const users = await User.find();
  
    // Schedule a job for each user
    for (const user of users) {
      const nextMonday = moment().tz(user.timezone).startOf('week').add(1, 'week').toDate();
      agenda.schedule(nextMonday, 'calculate streaks', { userId: user._id });
    }
};
