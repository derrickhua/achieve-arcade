import express from 'express';
import { createSuggestion, getSuggestions } from '../controllers/suggestion.js';
import authenticate from '../middleware/authenticate.js'; // Import your authentication middleware

const router = express.Router();

router.post('/', authenticate, createSuggestion);
router.get('/', authenticate, getSuggestions);

export default router;
