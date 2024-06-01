import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    completed: { type: Boolean, default: false },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    timeBlockId: { type: Schema.Types.ObjectId, ref: 'TimeBlock' } // Reference to TimeBlock if applicable
  });
  
  // Method to handle task completion and award coins
  TaskSchema.methods.completeTask = async function() {
    this.completed = true;
    await this.save();
  
    const user = await mongoose.model('User').findById(this.userId);
    let coins = 1; // Default for easy tasks
    if (this.difficulty === 'Medium') {
      coins = 2;
    } else if (this.difficulty === 'Hard') {
      coins = 3;
    }
  
    // If task is part of a time block, increase coin reward
    if (this.timeBlockId) {
      coins *= 1.5; // Example multiplier for tasks under a time block
    }
  
    user.coins += coins;
    await user.save();
  };
  
  const Task = mongoose.model('Task', TaskSchema);
  
  export default Task;
  