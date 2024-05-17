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
  velocity: { type: Number, default: null },  // Store calculated velocity directly
});

MilestoneSchema.index({ deadline: 1 });  // Index on deadline field
MilestoneSchema.index({ completed: 1 }); // Index on completed field

async function calculateAndUpdateGoalMetrics(goalId, milestoneId) {
  const goal = await Goal.findById(goalId, 'milestones createdAt updatedAt').exec();
  if (!goal || goal.milestones.length === 0) return;

  const milestone = goal.milestones.id(milestoneId);
  if (!milestone || !milestone.completed || !milestone.completionDate) return;

  // Calculate velocity for the updated milestone
  const milestoneStart = new Date(goal.createdAt).getTime();
  const deadlineTime = new Date(milestone.deadline).getTime();
  const completionTime = new Date(milestone.completionDate).getTime();
  const plannedDuration = deadlineTime - milestoneStart;
  const actualDuration = completionTime - milestoneStart;
  milestone.velocity = plannedDuration > 0 ? (actualDuration / plannedDuration) * 100 : 0;

  // Update only the changed milestone in the database
  await Goal.updateOne(
      { "_id": goalId, "milestones._id": milestoneId },
      { "$set": { "milestones.$.velocity": milestone.velocity } }
  );

  // Optionally recalculate progress and deadline adherence if needed
  if (milestone.completed) {
      let adherentMilestones = 0;
      let totalVelocity = 0;
      let completedMilestonesCount = 0;

      goal.milestones.forEach(m => {
          if (m.completed) {
              completedMilestonesCount++;
              if (m.completionDate && new Date(m.completionDate) <= new Date(m.deadline)) {
                  adherentMilestones++;
              }
              totalVelocity += m.velocity || 0;
          }
      });

      const progress = (completedMilestonesCount / goal.milestones.length) * 100;
      const deadlineAdherence = completedMilestonesCount > 0 ? (adherentMilestones / completedMilestonesCount) * 100 : 0;
      const milestoneVelocity = completedMilestonesCount > 0 ? totalVelocity / completedMilestonesCount : 0;

      await Goal.updateOne(
          { "_id": goalId },
          { "$set": { "progress": progress, "deadlineAdherence": deadlineAdherence, "milestoneVelocity": milestoneVelocity } }
      );
  }
}

// Middleware to update metrics when a milestone is saved
MilestoneSchema.post('save', async function (doc, next) {
  if (this.isModified('completed')) {
    await calculateAndUpdateGoalMetrics(this.parent()._id);
  }
  next();
});

// Middleware to update metrics when a milestone is removed
MilestoneSchema.post('remove', async function (doc, next) {
  await calculateAndUpdateGoalMetrics(this.parent()._id);
  next();
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
  title: String,
  description: String,
  reason: String,
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
  deadlineAdherence: {
    type: Number,
    default: 0  // Percentage of milestones completed on or before their deadline
  },
  milestoneVelocity: {
    type: Number,
    default: 0  // Average velocity of completing milestones relative to their deadlines
  },
  history: [HistorySchema],
  createdAt: Date,
  updatedAt: Date
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
