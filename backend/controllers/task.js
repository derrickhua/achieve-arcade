import mongoose from 'mongoose';
import Task from '../models/task.js';
import { DailySchedule, TimeBlock } from '../models/dailySchedule.js';
import User from '../models/user.js';

/**
 * Creates a new task for the user based on the provided details.
 * Validates the required fields and adds the task to the database.
 * @param {Request} req - The request object, containing user and task details.
 * @param {Response} res - The response object used to return the status and created task.
 */
export const addTask = async (req, res, next) => {
  const { name, difficulty } = req.body;

  // Validate input data
  if (!name) {
      return res.status(400).json({ message: 'Task name is required' });
  }

  try {
      const user = await User.findById(req.user._id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.subscription !== 'pro') {
          const uncompletedTaskCount = await Task.countDocuments({ userId: req.user._id, completed: false });
          if (uncompletedTaskCount >= 4) {
              return res.status(400).json({ message: 'Free tier users can only have a maximum of 4 uncompleted tasks' });
          }
      }

      const newTask = new Task({
          userId: req.user._id,  // Assuming user ID is available from auth middleware
          name,
          difficulty
      });

      await newTask.save();
      res.status(201).json(newTask);
  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Something went wrong while creating the task', error: error.message });
  }
};


/**
 * Retrieves the number of completed tasks and all uncompleted tasks for the user.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the task data.
 */
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Count completed tasks
    const completedTaskCount = await Task.countDocuments({ userId, completed: true });

    // Find uncompleted tasks
    const uncompletedTasks = await Task.find({ userId, completed: false });

    // Return the task data
    res.json({
      completedTaskCount,
      uncompletedTasks
    });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
    const { taskId } = req.params;
    const { name, difficulty, completed } = req.body;
  
    try {
      const updateFields = {};
  
      // Update fields if provided
      if (name) updateFields.name = name;
      if (difficulty) updateFields.difficulty = difficulty;
      if (typeof completed === 'boolean') updateFields.completed = completed;
  
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error('Task not found');
        error.status = 404;
        throw error;
      }
  
      const wasCompleted = task.completed;
  
      Object.assign(task, updateFields);
      await task.save();
  
      // Call completeTask if task is marked as completed
      if (completed && !wasCompleted) {
        await task.completeTask();
      }
  
      // Check if the task is part of a time block
      if (task.timeBlockId) {
        let timeBlock = await TimeBlock.findById(task.timeBlockId).populate('tasks');
  
        // Check if all tasks within the time block are completed
        let allTasksCompleted;
        if (completed) {
          allTasksCompleted = timeBlock.tasks.every(t => t.completed);
        } else {
          allTasksCompleted = false;
        }
  
        // Update the completion status of the time block based on the tasks
        if (allTasksCompleted && !timeBlock.completed) {
          await timeBlock.completeTimeBlock();
        } else if (!allTasksCompleted && timeBlock.completed) {
          await timeBlock.incompleteTimeBlock();
        }
  
        // Update the DailySchedule document
        await DailySchedule.updateOne(
          { 'timeBlocks._id': timeBlock._id },
          { $set: { 'timeBlocks.$.completed': allTasksCompleted } }
        );
      }
  
      res.json(task);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        error.status = 400;  // Bad Request for validation errors
      } else if (error instanceof mongoose.Error.CastError) {
        error.status = 400;  // Bad Request for casting errors, typically invalid format
        error.message = 'Invalid ID format.';
      }
      console.error(`Error updating task ${taskId}:`, error);
      next(error);
    }
  };
  

/**
 * Deletes a specific task by its ID.
 * Verifies the task's existence and removes it from the database.
 * @param {Request} req - The request object, containing the task ID.
 * @param {Response} res - The response object used to confirm deletion.
 */
export const deleteTask = async (req, res, next) => {
    const { taskId } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            const error = new Error('Task not found');
            error.status = 404;
            throw error; // Throw the error to be caught by the catch block
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            error.status = 400; // Bad Request
            error.message = 'Invalid ID format.';
        }
        next(error); // Pass any caught error to the error handling middleware
    }
};
