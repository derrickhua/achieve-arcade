// routes/goal.js
import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  createGoal,
  getAllGoals,
  updateGoal,
  deleteGoal,
  filterSortGoals,
  updateCategory,
  getGoalHistory,
  getGoalMilestones,
  getMilestones,
  updateMilestone,
  deleteMilestone,
  completeMilestone
} from '../controllers/goal.js';

const router = express.Router();

// Applying authentication middleware to all goal routes
router.use(authenticate);

// Define the routes and associate them with the controller functions
router.post('/', createGoal); // Create a new goal
router.get('/', getAllGoals); // Get all goals for a user
router.get('/:goalId/milestones', getMilestones); // Get all milestones for a goal
router.put('/:id', updateGoal); // Update an existing goal
router.delete('/:id', deleteGoal); // Delete a goal
router.get('/filterSort', filterSortGoals); // Filter and sort goals
router.patch('/:id/category', updateCategory); // Update the category of a goal
router.get('/:id/history', getGoalHistory); // Get the history of changes to a goal
router.get('/:id/milestones', getGoalMilestones); // Get all milestones for a goal
router.patch('/:goalId/milestones/:milestoneId', updateMilestone); // Update a specific milestone within a goal
router.delete('/:goalId/milestones/:milestoneId', deleteMilestone); // Delete a specific milestone from a goal
router.patch('/:goalId/milestones/:milestoneId/complete', completeMilestone); // Complete a specific milestone within a goal

export default router;
