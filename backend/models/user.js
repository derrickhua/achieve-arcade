import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the User schema
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
  // Add any additional user fields as needed
});

// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

export default User
