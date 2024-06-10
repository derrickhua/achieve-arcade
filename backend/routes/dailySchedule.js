import express from 'express';
import { getDailySchedule, addTimeBlock, updateTimeBlock, deleteTimeBlock, getWeeklyMetrics } from '../controllers/dailySchedule.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();
router.use(authenticate);
router.get('/daily', getDailySchedule);
router.post('/timeBlock', addTimeBlock);
router.put('/timeBlock/:blockId', updateTimeBlock);
router.delete('/timeBlock/:blockId', deleteTimeBlock);
router.get('/weeklyMetrics', getWeeklyMetrics);

export default router;
