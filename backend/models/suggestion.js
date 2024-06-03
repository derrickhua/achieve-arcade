// models/Suggestion.js
import mongoose from 'mongoose';

const SuggestionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    subject: { type: String, required: true },  
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Suggestion = mongoose.model('Suggestion', SuggestionSchema);

export default Suggestion;
