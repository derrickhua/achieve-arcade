import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the Habit schema
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
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  occurrences: {  // Track the actual occurrences of the habit
    type: Number,
    default: 0
  },
  consistencyGoal: {  // Target number of times the habit should be completed in its frequency period
    type: Number,
    default: 1  // Assumes at least once per period unless specified otherwise
  }
}, { timestamps: true });  // Including timestamps for creation and update tracking

// Create the Habit model from the schema
const Habit = mongoose.model('Habit', HabitSchema);

export default Habit;
