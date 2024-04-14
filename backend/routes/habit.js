import express from 'express';
import { addHabit, getHabits, updateHabit, deleteHabit, completeHabit } from '../controllers/habit.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Applying authentication middleware to all habit routes
router.get('/', authenticate, getHabits);
router.post('/add', authenticate, addHabit);
router.post('/:habitId/complete', authenticate, completeHabit);
router.put('/update/:habitId', authenticate, updateHabit);
router.delete('/delete/:habitId', authenticate, deleteHabit);

export default router;
