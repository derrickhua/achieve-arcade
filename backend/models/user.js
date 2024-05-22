import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  timezone: {  // New field for storing the user's timezone
    type: String,
    required: true
  },
  preferences: {
    workHoursPerWeek: { type: Number, required: true }, // in hours
    leisureHoursPerWeek: { type: Number, required: true }, // in hours
    familyFriendsHoursPerWeek: { type: Number, required: true }, // in hours
    atelicHoursPerWeek: { type: Number, required: true } // in hours
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
