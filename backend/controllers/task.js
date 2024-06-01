import Task from '../models/task.js';

/**
 * Creates a new task for the user based on the provided details.
 * Validates the required fields and adds the task to the database.
 * @param {Request} req - The request object, containing user and task details.
 * @param {Response} res - The response object used to return the status and created task.
 */
export const addTask = async (req, res, next) => {
    const { name, dueDate, category, notes } = req.body;

    // Validate input data
    if (!name) {
        const error = new Error('Task name is required');
        error.status = 400;
        return next(error);
    }

    try {
        const newTask = new Task({
            userId: req.user._id,  // Assuming user ID is available from auth middleware
            name,
            dueDate: dueDate ? new Date(dueDate) : null,
            category,
            notes
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves all tasks for the user.
 * @param {Request} req - The request object, containing user authentication data.
 * @param {Response} res - The response object used to return the list of tasks.
 */
export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates a specific task based on provided parameters.
 * @param {Request} req - The request object, including task ID and update details.
 * @param {Response} res - The response object used to return the updated task.
 */
export const updateTask = async (req, res, next) => {
    const { taskId } = req.params;
    const { name, dueDate, category, notes, completed } = req.body;

    try {
        const updateFields = {};

        // Update fields if provided
        if (name) updateFields.name = name;
        if (dueDate) updateFields.dueDate = new Date(dueDate);
        if (category) updateFields.category = category;
        if (notes) updateFields.notes = notes;
        if (typeof completed === 'boolean') updateFields.completed = completed;

        const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, { new: true });
        if (!updatedTask) {
            const error = new Error('Task not found');
            error.status = 404;
            throw error;
        }

        res.json(updatedTask);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            error.status = 400;  // Bad Request for validation errors
        } else if (error instanceof mongoose.Error.CastError) {
            error.status = 400;  // Bad Request for casting errors, typically invalid format
            error.message = 'Invalid ID format.';
        }
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
