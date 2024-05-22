import mongoose from 'mongoose';
const { Schema } = mongoose;

const TaskSchema = new Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const TimeBlockSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  tasks: [TaskSchema],
  timerStartedAt: { type: Date },
  timerDuration: { type: Number, default: 0 }, // in seconds
  category: { type: String, enum: ['work', 'leisure', 'family_friends', 'atelic'], required: true },
  completed: { type: Boolean, default: false } // For time blocks without tasks
});

const DailyScheduleSchema = new Schema({
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timeBlocks: [TimeBlockSchema]
});

DailyScheduleSchema.index({ userId: 1, date: 1 });

const UserPreferencesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workHoursPerWeek: { type: Number, required: true }, // in hours
  leisureHoursPerWeek: { type: Number, required: true }, // in hours
  familyFriendsHoursPerWeek: { type: Number, required: true }, // in hours
  atelicHoursPerWeek: { type: Number, required: true } // in hours
});

UserPreferencesSchema.index({ userId: 1 });

const DailySchedule = mongoose.model('DailySchedule', DailyScheduleSchema);
const UserPreferences = mongoose.model('UserPreferences', UserPreferencesSchema);

export { DailySchedule, UserPreferences };
