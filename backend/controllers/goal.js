import Goal from '../models/goal.js';

import mongoose from 'mongoose';
/**
 * Create a new goal with initial properties and automatically generated milestones.
 * @param {Object} req - The request object containing the user's goal details.
 * @param {Object} res - The response object to send back the created goal.
 */
export const createGoal = async (req, res) => {
    try {
        console.log("User ID from req.user:", req.user?._id); // Ensure this is not undefined
        const { title, description, reason, deadline, priority, category } = req.body;

        if (!req.user?._id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newGoal = new Goal({
            user: req.user._id,
            title,
            description,
            reason,
            deadline,
            priority,
            category
        });
        
        await newGoal.save();
        res.status(201).json(newGoal);
        newGoal.generateMilestones(); // Automatically generate milestones for the new goal
    } catch (error) {
        console.error("Error in createGoal:", error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Retrieves all goals for a specific user, enhanced with comprehensive metrics for each goal.
 * Metrics include progress, milestone completion, deadline adherence, goal velocity, and status overview.
 * This integration allows for a single API call to fetch both the goals and their associated detailed metrics,
 * facilitating efficient data handling and visualization on the client side.
 *
 * @param {Object} req - The request object, including potential user and authentication details.
 * @param {Object} res - The response object used to send back the list of enriched goals.
 * @param {Function} next - The next middleware function in the stack, used for error handling.
 */
export const getAllGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        const enhancedGoals = await Promise.all(goals.map(async (goal) => {
            const completedMilestones = goal.milestones.filter(m => m.completed);
            const adherentMilestones = completedMilestones.filter(m => m.completionDate && m.deadline && (new Date(m.completionDate) <= new Date(m.deadline))).length;
            const milestoneDeadlineAdherencePercentage = completedMilestones.length > 0 ? (adherentMilestones / completedMilestones.length) * 100 : 0;
            
            const goalDeadlineAdherence = goal.completed && goal.updatedAt && goal.deadline && (goal.updatedAt <= goal.deadline);

            const totalDaysPlanned = goal.deadline ? (new Date(goal.deadline).getTime() - new Date(goal.createdAt).getTime()) / (1000 * 3600 * 24) : 0;
            const daysUntilCompletion = goal.status === 'Completed' ? (new Date(goal.updatedAt).getTime() - new Date(goal.createdAt).getTime()) / (1000 * 3600 * 24) : 0;
            const goalVelocity = totalDaysPlanned > 0 ? (daysUntilCompletion / totalDaysPlanned) * 100 : 0;
            
            return {
                ...goal.toJSON(), // Convert Mongoose document to JSON
                metrics: {
                    progress: goal.progress,
                    milestoneCompletion: {
                        total: goal.milestones.length,
                        completed: completedMilestones.length
                    },
                    deadlineAdherence: {
                        goal: goal.status === 'Completed' && new Date(goal.updatedAt) <= new Date(goal.deadline) ? 100 : 0,
                        milestones: milestoneDeadlineAdherencePercentage
                    },
                    goalVelocity
                }
            };
        }));

        res.status(200).json(enhancedGoals);
    } catch (error) {
        next(error);  // Pass any errors to the centralized error handler
    }
};

/**
 * Update an existing goal with new details provided by the user.
 * @param {Object} req - The request object containing updates and the goal ID.
 * @param {Object} res - The response object to send back the updated goal.
 */
export const updateGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedGoal) {
        return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Delete a specific goal by its ID.
 * @param {Object} req - The request object containing the goal ID.
 * @param {Object} res - The response object to confirm deletion.
 */
export const deleteGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedGoal = await Goal.findByIdAndDelete(id);
        if (!deletedGoal) {
        return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(204).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves a list of goals filtered and sorted based on query parameters.
 * Allows sorting and filtering by various criteria such as status, priority, and deadline.
 * @param {Object} req - The request object containing query parameters for filtering and sorting.
 * @param {Object} res - The response object to send back the filtered and sorted goals.
 */
export const filterSortGoals = async (req, res) => {
    try {
        const queryOptions = {
        user: req.user.id, // Ensure the user is authenticated and their ID is available
        ...req.query
        };
        const goals = await Goal.find(queryOptions)
        .sort({ deadline: 1 }) // Example: sort by deadline
        .exec();
        res.status(200).json(goals);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Updates the category list for a specific goal.
 * Allows addition, deletion, or modification of category associated with a goal.
 * @param {Object} req - The request object containing the goal's ID in the URL and the new category in the body.
 * @param {Object} res - The response object to send back the updated goal.
 */
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    try {
    const updatedGoal = await Goal.findByIdAndUpdate(id, { updateCategory }, { new: true });
    res.status(200).json(updatedGoal);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
};

/**
 * Retrieves the history of changes made to a specific goal.
 * Each entry in the history logs an action and description of what was changed.
 * @param {Object} req - The request object containing the goal's ID in the URL.
 * @param {Object} res - The response object to send back the goal's history.
 */
export const getGoalHistory = async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await Goal.findById(id).select('history');
        res.status(200).json(goal.history);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Marks a goal as completed and sets the progress to 100%.
 * Should only be called when all milestones within the goal are confirmed as completed or when manually marking as completed.
 * @param {Object} req - The request object containing the goal's ID in the URL.
 * @param {Object} res - The response object to send back the updated goal.
 */
export const completeGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(id, { status: 'Completed', progress: 100 }, { new: true });
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getGoalMilestones = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        res.json(goal.milestones)
    } catch (error) {
        console.error('Error in getGoalMilestones:', error);
        res.status(500).json({message:error.messager})
    }
}

/**
 * Marks a specific milestone within a goal as completed.
 * Updates the milestone's completed status and recalculates the goal's overall progress.
 * @param {Object} req - The request object containing the goal ID and milestone ID in the URL.
 * @param {Object} res - The response object to send back the completed milestone.
 */
export const completeMilestone = async (req, res) => {
    const { goalId, milestoneId } = req.params;
    try {
        // Step 1: Atomically mark the milestone as completed
        const updateResult = await Goal.updateOne(
            { "_id": goalId, "milestones._id": milestoneId },
            {
                "$set": {
                    "milestones.$.completed": true,
                    "milestones.$.completionDate": new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "Milestone not found" });
        }

        // Step 2: Recalculate progress without needing a separate update if possible
        const goal = await Goal.findById(goalId);
        const totalMilestones = goal.milestones.length;
        const completedMilestones = goal.milestones.filter(m => m.completed).length;
        const progress = (completedMilestones / totalMilestones) * 100;

        // Update progress and status atomically
        const progressUpdate = await Goal.updateOne(
            { "_id": goalId },
            {
                "$set": {
                    "progress": progress,
                    "status": completedMilestones === totalMilestones ? 'Completed' : goal.status
                }
            }
        );

        if (progressUpdate.matchedCount === 0) {
            console.error("Failed to update goal progress");
            // Optionally, add recovery logic here
        }

        const updatedGoal = await Goal.findById(goalId);
        const updatedMilestone = updatedGoal.milestones.id(milestoneId);
        res.status(200).json(updatedMilestone);
    } catch (error) {
        console.error("Error completing milestone:", error);
        res.status(400).json({ message: error.message });
    }
};



/**
 * Updates a specific milestone within a goal.
 * Allows modification of the milestone's title, description, deadline, and completion status.
 * @param {Object} req - The request object containing the goal ID and milestone ID in the URL, and the new milestone data in the body.
 * @param {Object} res - The response object to send back the updated milestone.
 */
export const updateMilestone = async (req, res) => {
    const { goalId, milestoneId } = req.params;
    const { title, description, deadline } = req.body;

    try {
        const updateFields = {};
        if (title !== undefined) updateFields["milestones.$.title"] = title;
        if (description !== undefined) updateFields["milestones.$.description"] = description;
        if (deadline !== undefined) updateFields["milestones.$.deadline"] = deadline;

        const updateResult = await Goal.updateOne(
            { "_id": goalId, "milestones._id": milestoneId },
            { "$set": updateFields }
        );

        if (updateResult.nModified === 0) {
            return res.status(404).json({ message: "Milestone not found or no update needed" });
        }

        const updatedGoal = await Goal.findById(goalId);
        const updatedMilestone = updatedGoal.milestones.id(milestoneId);
        res.status(200).json(updatedMilestone);
    } catch (error) {
        console.error("Error updating milestone:", error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Deletes a specific milestone from a goal.
 * Removes the milestone entirely from the goal's milestone list.
 * @param {Object} req - The request object containing the goal ID and milestone ID in the URL.
 * @param {Object} res - The response object confirming the deletion.
 */
export const deleteMilestone = async (req, res) => {
    const { goalId, milestoneId } = req.params;
    try {
        // Use $pull to directly remove the subdocument by its _id
        const result = await Goal.findByIdAndUpdate(goalId, {
            $pull: { milestones: { _id: milestoneId } }
        }, { new: true });

        if (!result) {
            return res.status(404).json({ message: "Goal not found or Milestone not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting milestone:", error);
        res.status(400).json({ message: error.message });
    }
};