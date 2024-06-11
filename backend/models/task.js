import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const monsters = [
  "big-demon",
  "big-orc",
  "doc",
  "ice-zombie",
  "lizard",
  "mask-orc",
  "mini-demon",
  "mini-orc",
  "mud",
  "necro",
  "orc",
  "pumpkin",
  "shaman-orc",
  "short-demon",
  "skeleton",
  "swamp",
  "zombie"
];

const TaskSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  completed: { type: Boolean, default: false },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  timeBlockId: { type: Schema.Types.ObjectId, ref: 'TimeBlock' }, // Reference to TimeBlock if applicable
  monster: { type: String, default: () => monsters[Math.floor(Math.random() * monsters.length)] } // Randomly assign a monster name
});

// Method to handle task completion and award coins
TaskSchema.methods.completeTask = async function() {
  this.completed = true;
  await this.save();

  let coins = 1; // Default for easy tasks
  if (this.difficulty === 'Medium') {
    coins = 2;
  } else if (this.difficulty === 'Hard') {
    coins = 3;
  }

  // If task is part of a time block, increase coin reward
  if (this.timeBlockId) {
    coins = Math.floor(coins * 1.5); // Example multiplier for tasks under a time block
  }

  // Update the user's coins using $inc
  await mongoose.model('User').findByIdAndUpdate(
    this.userId,
    { $inc: { coins: coins } }
  );

  console.log(`User ${this.userId} awarded ${coins} coins.`);
};

const Task = mongoose.model('Task', TaskSchema);

export default Task;
