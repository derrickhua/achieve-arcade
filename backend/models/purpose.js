import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PurposeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // Ensures one-to-one relationship between User and Purpose
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });  // Optional: Adds createdAt and updatedAt fields

const Purpose = mongoose.model('Purpose', PurposeSchema);

export default Purpose;
