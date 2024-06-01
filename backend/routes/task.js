import express from 'express';
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask
} from '../controllers/task.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Applying authentication middleware to all task routes
router.use(authenticate); 

// GET all tasks for the authenticated user
router.get('/', getTasks);

// POST a new task
router.post('/', addTask);

// PUT to update an existing task
router.put('/:taskId', updateTask);

// DELETE an existing task
router.delete('/:taskId', deleteTask);

export default router;
