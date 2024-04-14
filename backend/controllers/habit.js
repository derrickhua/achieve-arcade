import Habit from '../models/habit.js';

export const addHabit = async (req, res) => {
    console.log("User ID from req.user:", req.user._id); // Check if user ID is available
    const { name, habitPeriod, consistencyGoal } = req.body;
    try {
        const newHabit = new Habit({
            user: req.user._id,  // Assuming user ID is available from auth middleware
            name,
            habitPeriod,
            consistencyGoal
        });
        await newHabit.save();
        console.log('New habit added:', newHabit)
        res.status(201).json(newHabit);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding new habit' });
    }
};

export const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user._id });
        console.log('Got habits')
        res.json(habits);
    } catch (error) {
        console.log(error)

        res.status(500).json({ error: 'Error fetching habits' });
    }
};

export const updateHabit = async (req, res) => {
    const { habitId } = req.params;
    try {
        const updatedHabit = await Habit.findByIdAndUpdate(habitId, req.body, { new: true });
        if (!updatedHabit) {
            return res.status(404).json({ error: 'Habit not found' });
        }
        console.log('Habit updated:', updatedHabit)
        res.json(updatedHabit);
    } catch (error) {
        console.log(error)

        res.status(500).json({ error: 'Error updating habit' });
    }
};

export const deleteHabit = async (req, res) => {
    const { habitId } = req.params;
    try {
        const deletedHabit = await Habit.findByIdAndDelete(habitId);
        if (!deletedHabit) {
            return res.status(404).json({ error: 'Habit not found' });
        }
        console.log('Habit deleted:', deletedHabit)
        res.status(204).send();
    } catch (error) {
        console.log(error)

        res.status(500).json({ error: 'Error deleting habit' });
    }
};

export const completeHabit = async (req, res) => {
    const { habitId } = req.params;
    const currentDate = new Date();
    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Update occurrences and check the last completion date for streaks
        habit.occurrences += 1;

        // Handling streaks
        const lastCompletionDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
        if (lastCompletionDate) {
            const differenceInDays = (currentDate - lastCompletionDate) / (1000 * 3600 * 24);
            if (differenceInDays <= 1 || (habit.habitPeriod === 'Weekly' && differenceInDays <= 7) || (habit.habitPeriod === 'Monthly' && differenceInDays <= 30)) {
                habit.streak += 1;
            } else {
                habit.streak = 1; // Reset streak if the completion is not consecutive
            }
        } else {
            habit.streak = 1; // Start streak if it's the first completion
        }

        habit.lastCompleted = currentDate; // Update the last completed time
        console.log('Habit completed:', habit)
        await habit.save();
        res.json(habit);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error completing habit' });
    }
};
