import mongoose from 'mongoose';
import User from './user.js';
const Schema = mongoose.Schema;
const RewardSchema = new Schema({
  name: { type: String, required: true },
  icon: String,
  chestType: {
    type: String,
    enum: ["Wood", "Metal", "Gold"],
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

const Reward = mongoose.model('Reward', RewardSchema);

export default Reward;

