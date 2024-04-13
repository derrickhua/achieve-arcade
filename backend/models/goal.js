import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MilestoneSchema = new Schema({
  title: String,
  description: String,
  deadline: Date,
  completed: { type: Boolean, default: false },
  completionDate: Date,  // Added to track when a milestone is completed
});

const GoalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  milestones: [MilestoneSchema],
  progress: {  // Added to track the current progress
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  priority: {  // Added to signify the importance
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  categories: [{ type: String }],  // Added for tagging or categorizing the goal
  createdAt: {  // Auto-generated timestamps for creation
    type: Date,
    default: Date.now
  },
  updatedAt: {  // Auto-generated timestamps for updates
    type: Date,
    default: Date.now
  }
}, { timestamps: true });  // This line ensures that Mongoose handles the creation and update timestamps

const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
