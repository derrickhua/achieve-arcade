import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateHabit } from '@/lib/habit';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Habit {
  _id: string;
  name: string;
  habitPeriod: string;
  difficulty: string;
  consistencyGoals: {
    goal: number;
    effectiveDate: string;
  };
}

interface EditHabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchHabits: () => Promise<void>;
  habit: Habit; // The habit to edit
}

const EditHabitForm: React.FC<EditHabitFormProps> = ({ isOpen, onClose, fetchHabits, habit }) => {
  const [name, setName] = useState(habit.name || '');
  const [habitPeriod, setHabitPeriod] = useState(habit.habitPeriod || 'Daily');
  const [goal, setGoal] = useState(habit.consistencyGoals.goal || 1);
  const [difficulty, setDifficulty] = useState(habit.difficulty || 'Medium');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const maxNameLength = 20;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxNameLength) {
      setName(e.target.value);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setShowAlert(true);
      setAlertMessage('Name is required.');
      isValid = false;
    }
    if (!habitPeriod) {
      setShowAlert(true);
      setAlertMessage('Habit period is required.');
      isValid = false;
    }
    if (!goal) {
      setShowAlert(true);
      setAlertMessage('Consistency goal is required.');
      isValid = false;
    }
    if (!difficulty) {
      setShowAlert(true);
      setAlertMessage('Difficulty is required.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const updateData = {
      name,
      habitPeriod,
      consistencyGoals: {
        goal: goal,
        effectiveDate: new Date().toISOString(),
      },
      difficulty,
    };

    try {
      await updateHabit(habit._id, updateData);
      await fetchHabits();
      setShowAlert(true);
      setAlertMessage('Habit updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update habit:', error);
      setShowAlert(true);
      setAlertMessage('Error updating habit. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">EDIT HABIT</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Update your habit details here!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="name">Name</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter habit name"
              maxLength={maxNameLength}
              required
            />
            <div className="text-right text-[14px] text-[#BDBDBD]">
              {name.length}/{maxNameLength} characters
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-black text-[25px]" htmlFor="habitPeriod">Habit Period</label>
            <Select onValueChange={setHabitPeriod} value={habitPeriod}>
              <SelectTrigger className="w-full bg-white border border-[#BDBDBD]">
                <SelectValue placeholder="Select Habit Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-black text-[25px]" htmlFor="goal">Consistency Goal</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="number"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="difficulty">Difficulty</label>
            <Select onValueChange={setDifficulty} value={difficulty}>
              <SelectTrigger className="w-full border border-[#BDBDBD] bg-white">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showAlert && (
            <Alert variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
              <AlertTitle>{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
            >
              Update Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHabitForm;
