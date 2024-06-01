import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  timezone: { type: String, required: true },
  preferences: {
    workHoursPerWeek: { type: Number, required: true },
    leisureHoursPerWeek: { type: Number, required: true },
    familyFriendsHoursPerWeek: { type: Number, required: true },
    atelicHoursPerWeek: { type: Number, required: true }
  },
  coins: { type: Number, default: 0 }
}, { timestamps: true });

UserSchema.methods.awardCoins = function(coins) {
  this.coins += coins;
  return this.save();
};

UserSchema.methods.deductCoins = function(coins) {
  if (this.coins < coins) {
    throw new Error('Insufficient coins');
  }
  this.coins -= coins;
  return this.save();
};

const User = mongoose.model('User', UserSchema);

export default User;
