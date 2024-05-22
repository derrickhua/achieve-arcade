import express from 'express';
import {
    getDailySchedule,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    startTimer,
    stopTimer,
    getWeeklyMetrics
} from '../controllers/dailySchedule.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Applying authentication middleware to all daily schedule routes
router.use(authenticate);

// GET daily schedule for the current date
router.get('/', getDailySchedule);

// POST a new time block to the daily schedule
router.post('/time-block', addTimeBlock);

// PUT to update a specific time block
router.put('/time-block/:blockId', updateTimeBlock);

// DELETE a specific time block
router.delete('/time-block/:blockId', deleteTimeBlock);

// POST to start the timer for a specific time block
router.post('/time-block/:blockId/start-timer', startTimer);

// POST to stop the timer for a specific time block
router.post('/time-block/:blockId/stop-timer', stopTimer);

// GET weekly metrics for the user
router.get('/weekly-metrics', getWeeklyMetrics);

export default router;
