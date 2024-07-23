import mongoose from 'mongoose';
import { getMilestones } from '../openai.js';
const Schema = mongoose.Schema;

// Milestone Schema
const MilestoneSchema = new Schema({
  title: String,
  description: String,
  deadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return v <= this.parent().deadline;
      },
      message: props => `Milestone deadline (${props.value}) must be before the goal's deadline.`
    }
  },
  completed: { type: Boolean, default: false },
  completionDate: Date,
  velocity: { type: Number, default: null }
});

MilestoneSchema.index({ deadline: 1 });
MilestoneSchema.index({ completed: 1 });

// Method to handle milestone completion and award coins
MilestoneSchema.methods.completeMilestone = async function() {
  if (this.completed) {
    throw new Error('Milestone already completed');
  }

  this.completed = true;
  this.completionDate = new Date();

  const goal = await mongoose.model('Goal').findById(this.parent()._id);
  const user = await mongoose.model('User').findById(goal.user);

  let coins = 5; // Default for easy milestones
  if (goal.difficulty === 'Medium') {
    coins = 10;
  } else if (goal.difficulty === 'Hard') {
    coins = 15;
  } else if (goal.difficulty === 'Life-Changing') {
    coins = 25;
  }

  await mongoose.model('User').findByIdAndUpdate(user._id, { $inc: { coins } });
  await this.save();
};

const Milestone = mongoose.model('Milestone', MilestoneSchema);

// History Schema
const HistorySchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  action: String,
  description: String
});

// Goal Schema
const GoalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  completed: {
    type: Boolean,
    default: false
  },
  description: String,
  deadline: Date,
  milestones: [MilestoneSchema],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Life-Changing'],
  },
  category: {
    type: String,
    enum: ["Wellness", "Career", "Finance", "Leisure"],
    default: ''
  },
  history: [HistorySchema],
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

// Pre-save middleware to log updates to Goal history
GoalSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.history.push({
      action: 'Updated',
      description: 'Goal details updated'
    });
  }
  next();
});

// Method to handle goal completion and award coins
GoalSchema.methods.completeGoal = async function() {
  if (this.completed) {
    throw new Error('Goal already completed');
  }

  this.completed = true;
  this.completionDate = new Date();

  const user = await mongoose.model('User').findById(this.user);

  let coins = 10; // Default for easy goals
  if (this.difficulty === 'Medium') {
    coins = 20;
  } else if (this.difficulty === 'Hard') {
    coins = 30;
  } else if (this.difficulty === 'Life-Changing') {
    coins = 50;
  }

  await mongoose.model('User').findByIdAndUpdate(user._id, { $inc: { coins } });
  await this.save();
};

GoalSchema.methods.generateMilestones = async function() {
  if (this.title && this.description && this.deadline) {
    const today = new Date().toISOString().split('T')[0];
    const deadlineFormatted = new Date(this.deadline).toISOString().split('T')[0];

    const message = `The date today is ${today}. My goal is ${this.title} and my description of it is ${this.description}. My deadline for the goal is ${deadlineFormatted}.`;

    try {
      const milestonesData = await getMilestones(message);
      const milestones = milestonesData.map(milestone => {
        const validDate = new Date(milestone.deadline);

        if (isNaN(validDate)) {
          throw new Error(`Invalid deadline date: ${validDate}`);
        }

        return {
          title: milestone.title,
          description: milestone.description,
          deadline: validDate,
          completed: milestone.completed,
          completionDate: milestone.completionDate ? new Date(milestone.completionDate) : null
        };
      });

      await Goal.findByIdAndUpdate(this._id, {
        $push: { milestones: { $each: milestones } }
      }, { new: true });

    } catch (error) {
      console.error('Failed to generate milestones:', error);
    }
  }
};

const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
