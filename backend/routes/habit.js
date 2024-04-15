import express from 'express';
import {
    addHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    completeHabit
} from '../controllers/habit.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Applying authentication middleware to all habit routes
router.use(authenticate); 

// GET all habits for the authenticated user
router.get('/', getHabits);

// POST a new habit
router.post('/', addHabit);

// POST to complete a habit for today (or specified date in the body potentially)
router.post('/:habitId/complete', completeHabit);

// PUT to update an existing habit
router.put('/:habitId', updateHabit);

// DELETE an existing habit
router.delete('/:habitId', deleteHabit);

export default router;
