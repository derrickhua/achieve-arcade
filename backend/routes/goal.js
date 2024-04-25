import express from 'express';
import authenticate from '../middleware/authenticate.js';
import { createGoal, getAllGoals, updateGoal, deleteGoal, filterSortGoals, updateCategory, getGoalHistory,
    completeGoal, getGoalMilestones, updateMilestone, deleteMilestone, completeMilestone } from '../controllers/goal.js';

const router = express.Router();
// Applying authentication middleware to all habit routes
router.use(authenticate); 

// Define the routes and associate them with the controller functions
router.post('/', createGoal);
router.get('/', getAllGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.get('/filterSort', filterSortGoals);
router.patch('/:id/category', updateCategory);
router.get('/:id/history', getGoalHistory);
router.put('/:id/complete', completeGoal);
router.get('/:id/milestones', getGoalMilestones);
router.patch('/:goalId/milestones/:milestoneId', updateMilestone);
router.delete('/:goalId/milestones/:milestoneId', deleteMilestone);
router.patch('/:goalId/milestones/:milestoneId/complete', completeMilestone);

export default router;
