import mongoose from 'mongoose';
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
    throw new Error('Time block already completed');
  }

  const user = await mongoose.model('User').findById(this.userId);
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

  user.coins += coins;
  await user.save();

  this.completed = true;
  await this.save();

  return coins; // Return the number of coins awarded for this time block
};

const DailyScheduleSchema = new Schema({
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timeBlocks: [TimeBlockSchema],
  notes: { type: String } // Added notes section
});

export const TimeBlock = mongoose.model('TimeBlock', TimeBlockSchema);
export const DailySchedule = mongoose.model('DailySchedule', DailyScheduleSchema);

