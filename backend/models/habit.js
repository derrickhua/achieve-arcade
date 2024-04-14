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
  habitPeriod: {
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
  occurrences: [{ type: Date }],  
  lastCompleted: { type: Date },  
  consistencyGoal: {  
    type: Number,
    default: 1  
  }
}, { timestamps: true });  

// Create the Habit model from the schema
const Habit = mongoose.model('Habit', HabitSchema);

export default Habit;
