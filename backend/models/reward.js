import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RewardSchema = new Schema({
  name: { type: String, required: true },
  icon: String,
  chestType: {
    type: String,
    enum: ["Wood", "Metal", "Gold"],
    required: true
  }
});

const Reward = mongoose.model('Reward', RewardSchema);

export default Reward;

