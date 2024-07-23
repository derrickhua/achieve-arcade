import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addHabit } from '@/lib/habit';

interface Habit {
  name: string;
  habitPeriod: string;
  difficulty: string;
  goal: number;
  effectiveDate: string;
}

interface AddHabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchHabits: () => Promise<void>;
  habits: Habit[];
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ isOpen, onClose, fetchHabits, habits }) => {
  const [name, setName] = useState('');
  const [habitPeriod, setHabitPeriod] = useState('Daily');
  const [consistencyGoal, setConsistencyGoal] = useState(1);
  const [difficulty, setDifficulty] = useState('Medium');
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
    if (!consistencyGoal) {
      setShowAlert(true);
      setAlertMessage('Consistency goal is required.');
      isValid = false;
    }
    if (!difficulty) {
      setShowAlert(true);
      setAlertMessage('Difficulty is required.');
      isValid = false;
    }
    if (habits.length >= 12) {
      setShowAlert(true);
      setAlertMessage('You can only have a maximum of 12 habits.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const habitData: Habit = {
      name,
      habitPeriod,
      goal: consistencyGoal,
      effectiveDate: new Date().toISOString(),
      difficulty,
    };

    try {
      await addHabit(habitData);
      await fetchHabits();
      setName('');
      setHabitPeriod('Daily');
      setConsistencyGoal(1);
      setDifficulty('Medium');
      setShowAlert(true);
      setAlertMessage('Habit added successfully!');
      onClose();
    } catch (error: any) {
      console.error('Failed to create habit:', error);
      setShowAlert(true);
      setAlertMessage(error.message || 'Error adding habit. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-6 relative w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[20px] md:text-[30px]">ADD NEW HABIT</h2>
        <p className="text-[#BDBDBD] text-[15px] md:text-[20px] mb-4">Enter your habit details here!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
          <label className="block text-black text-[16px] md:text-[20px] mb-2" htmlFor="name">Name</label>
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
          <div className="text-right text-[12px] md:text-[14px] text-[#BDBDBD]">
            {name.length}/{maxNameLength} characters
          </div>
          </div>
          <div className="mb-4">
          <label className="block text-black text-[16px] md:text-[20px]" htmlFor="habitPeriod">Habit Period</label>
          <p className="text-[15px] md:text-[20px] text-[#BDBDBD] mb-2">Time frame in which you aim to complete the habit</p>
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
          <label className="block text-black text-[16px] md:text-[20px]" htmlFor="consistencyGoal">Consistency Goal</label>
          <p className="text-[15px] md:text-[20px] text-[#BDBDBD] mb-2">The # of times you aim to do the habit within the chosen habit period</p>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="number"
              id="consistencyGoal"
              value={consistencyGoal}
              onChange={(e) => setConsistencyGoal(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="">
          <label className="block text-black text-[16px] md:text-[20px] mb-2" htmlFor="difficulty">Difficulty</label>
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
              <AlertDescription className="text-[12px] md:text-[14px]">
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[15px] md:text-[20px]"
            >
              ADD HABIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;
