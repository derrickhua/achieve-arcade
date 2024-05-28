import express from 'express';
import { calculateMetrics } from '../controllers/dashboard.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Applying authentication middleware to all dashboard routes
router.use(authenticate);

// GET dashboard metrics
router.get('/metrics', calculateMetrics);

export default router;
