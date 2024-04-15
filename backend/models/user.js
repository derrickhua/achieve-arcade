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
  }
}, { timestamps: true }); 

const User = mongoose.model('User', UserSchema);

export default User;
