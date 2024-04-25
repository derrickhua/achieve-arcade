import mongoose from 'mongoose';
import { getMilestones } from '../openai.js';
const Schema = mongoose.Schema;

/**
 * Schema definition for Milestones, parts of a larger Goal.
 */
const MilestoneSchema = new Schema({
  title: String,
  description: String,
  deadline: {
    type: Date,
    validate: {
      validator: function(v) {
        // Ensure milestone deadline does not exceed the goal's deadline
        return v <= this.parent().deadline;
      },
      message: props => `Milestone deadline (${props.value}) must be before the goal's deadline.`
    }
  },
  completed: { type: Boolean, default: false },
  completionDate: Date,
});

MilestoneSchema.index({ deadline: 1 });  // Index on deadline field
MilestoneSchema.index({ completed: 1 }); // Index on completed field

/**
 * Post-save middleware to automatically update the progress on the parent Goal when a Milestone is saved.
 */
MilestoneSchema.post('save', async function () {
  const goal = await Goal.findById(this.parent()._id);
  const completedMilestones = goal.milestones.filter(m => m.completed);
  const progress = (completedMilestones.length / goal.milestones.length) * 100;
  goal.progress = progress;
  await goal.save();
});

/**
 * Post-remove middleware to adjust the progress on the parent Goal when a Milestone is removed.
 */
MilestoneSchema.post('remove', async function () {
  const goal = await Goal.findById(this.parent()._id);
  const completedMilestones = goal.milestones.filter(m => m.completed);
  const progress = (completedMilestones.length / goal.milestones.length) * 100;
  goal.progress = progress;
  await goal.save();
});

/**
 * Schema definition for tracking historical changes to Goals.
 */
const HistorySchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  action: String,
  description: String
});

/**
 * Main schema definition for Goals, containing various attributes and nested Milestones.
 */
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
  reason: String, // User's motivation for setting the goal
  deadline: Date,
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  milestones: [MilestoneSchema],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ["Health & Wellness", "Career & Education", "Finance", "Personal Development",
    "Family & Relationships", "Recreation & Leisure", "Spirituality"],
    default: ''
  },
  history: [HistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

/**
 * Pre-save middleware to log updates to Goal history if any modifications are detected.
 */
GoalSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.history.push({
      action: 'Updated',
      description: 'Goal details updated'
    });
  }
  next();
});

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

      // Update the document using findByIdAndUpdate
      await Goal.findByIdAndUpdate(this._id, {
        $push: { milestones: { $each: milestones } }
      }, { new: true });

      console.log('Milestones generated and added to the goal.');
    } catch (error) {
      console.error('Failed to generate milestones:', error);
    }
  }
};


const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
