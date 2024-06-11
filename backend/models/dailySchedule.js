import mongoose from 'mongoose';
import User from './user.js';  // Ensure this import is correct based on your file structure
const { Schema } = mongoose;

const TimeBlockSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }], // Reference to Task model
  timerDuration: { type: Number, default: 0 }, // in seconds
  category: { type: String, enum: ['work', 'leisure', 'family_friends', 'atelic'], required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Add userId to link to the user
});

// Method to handle time block completion and award coins
TimeBlockSchema.methods.completeTimeBlock = async function() {
  if (this.completed) {
    return; // Return early if already completed
  }

  const user = await User.findById(this.userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Calculate the duration if timerDuration is zero
  if (this.timerDuration === 0) {
    const start = new Date(this.startTime).getTime();
    const end = new Date(this.endTime).getTime();
    this.timerDuration = (end - start) / 1000; // Duration in seconds
  }

  let coins = 0;
  if (this.category === 'work' || this.category === 'leisure') {
    const durationInHours = this.timerDuration / 3600; // Convert seconds to hours

    if (durationInHours <= 1) {
      coins = 2;
    } else if (durationInHours <= 3) {
      coins = 4;
    } else {
      coins = 6;
    }
  }

  // Increment the user's coin balance using $inc
  await User.findByIdAndUpdate(this.userId, { $inc: { coins: coins } });

  this.completed = true;
  await this.save();

  // Propagate the change to the DailySchedule document
  await mongoose.model('DailySchedule').updateOne(
    { 'timeBlocks._id': this._id },
    { $set: { 'timeBlocks.$.completed': true, 'timeBlocks.$.timerDuration': this.timerDuration } }
  );


  return coins; // Return the number of coins awarded for this time block
};

// Method to handle time block incompletion and subtract coins
TimeBlockSchema.methods.incompleteTimeBlock = async function() {
  if (!this.completed) {
    return; // Return early if not completed
  }

  const user = await User.findById(this.userId);
  if (!user) {
    throw new Error('User not found');
  }

  let coins = 0;
  if (this.category === 'work' || this.category === 'leisure') {
    const durationInHours = this.timerDuration / 3600; // Convert seconds to hours

    if (durationInHours <= 1) {
      coins = 2;
    } else if (durationInHours <= 3) {
      coins = 4;
    } else {
      coins = 6;
    }
  }

  // Decrement the user's coin balance using $inc
  await User.findByIdAndUpdate(this.userId, { $inc: { coins: -coins } });

  this.completed = false;
  this.timerDuration = 0; // Reset the timer duration
  await this.save();
  console.log('Time block saved with reset timer duration and incomplete status');

  // Propagate the change to the DailySchedule document
  await mongoose.model('DailySchedule').updateOne(
    { 'timeBlocks._id': this._id },
    { $set: { 'timeBlocks.$.completed': false, 'timeBlocks.$.timerDuration': 0 } }
  );

  console.log('DailySchedule updated with the reset time block duration and incomplete status');

  return coins; // Return the number of coins subtracted for this time block
};

const DailyScheduleSchema = new Schema({
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timeBlocks: [TimeBlockSchema],
  notes: { type: String } // Added notes section
});

export const TimeBlock = mongoose.model('TimeBlock', TimeBlockSchema);
export const DailySchedule = mongoose.model('DailySchedule', DailyScheduleSchema);
