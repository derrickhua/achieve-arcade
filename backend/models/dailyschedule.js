const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Task schema
const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  habitAssociated: {
    type: Schema.Types.ObjectId,
    ref: 'Habit',  // Associating a task with a Habit if applicable
    required: false
  }
});

// Define the Time Block schema
const TimeBlockSchema = new Schema({
  name: {
    type: String,
    required: true  // Could be a specific activity like 'Work' or 'Exercise'
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  tasks: [TaskSchema],
  completed: {
    type: Boolean,
    default: false  // Whether the time block was successfully executed
  },
  actualEndTime: {
    type: Date,  // Time when the last task was completed or block was marked complete
    required: false
  }
});

// Define the DailySchedule schema
const DailyScheduleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeBlocks: [TimeBlockSchema]
});

// Create the models from the schemas
const Task = mongoose.model('Task', TaskSchema);
const TimeBlock = mongoose.model('TimeBlock', TimeBlockSchema);
const DailySchedule = mongoose.model('DailySchedule', DailyScheduleSchema);

module.exports = { Task, TimeBlock, DailySchedule };
