import React, { useState } from 'react';
import { CalendarDays, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Utility Functions
import { createGoal } from '@/lib/goals';

interface Goal {
  title: string;
  description: string;
  deadline: string;
  category: string;
  difficulty: string;
}

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchGoals: () => Promise<void>;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ isOpen, onClose, fetchGoals }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  const maxTitleLength = 35;
  const maxDescriptionLength = 90;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxTitleLength) {
      setTitle(e.target.value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxDescriptionLength) {
      setDescription(e.target.value);
    }
  };

  const categoryOptions = ["Wellness", "Career", "Finance", "Leisure"];

  const validateForm = () => {
    let isValid = true;
    if (!title) {
      setShowAlert(true);
      setAlertMessage('Title is required.');
      isValid = false;
    }
    if (!deadline) {
      setShowAlert(true);
      setAlertMessage('Deadline is required.');
      isValid = false;
    }
    if (!description) {
        setShowAlert(true);
        setAlertMessage('Description is required.');
        isValid = false;
      }
      if (!category) {
        setShowAlert(true);
        setAlertMessage('Category is required.');
        isValid = false;
      }
      if (!difficulty) {
        setShowAlert(true);
        setAlertMessage('Difficulty is required.');
        isValid = false;
      }

    return isValid;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Create a new Date object and add one hour to it
      const adjustedDate = new Date(date.getTime());
      adjustedDate.setHours(adjustedDate.getHours() + 1);
      setDeadline(adjustedDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    }
  };
  
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const goalData: Goal = {
      title,
      description,
      deadline: new Date(deadline + 'T00:00').toISOString(),
      category,
      difficulty,
    };

    try {
      await createGoal(goalData);
      await fetchGoals();
      setTitle('');
      setDescription('');
      setDeadline('');
      setCategory('');
      setDifficulty('Medium');
      setShowAlert(true);
      setAlertMessage('Goal added successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to create goal:', error);
      setShowAlert(true);
      setAlertMessage('Error adding goal. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">ADD NEW GOAL</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Enter your goal details here!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="title">Title</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter goal title"
              maxLength={maxTitleLength}
              required
            />
            <div className="text-right text-[14px] text-text-[#BDBDBD]">
              {title.length}/{maxTitleLength} characters
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="description">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your goal"
              maxLength={maxDescriptionLength}
              rows={4}
              required
            />
            <div className="text-right text-[14px] text-text-[#BDBDBD]">
              {description.length}/{maxDescriptionLength} characters
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="deadline">Deadline</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full px-3 py-2 border border-[#BDBDBD] bg-white rounded-lg flex items-center justify-between">
                  {deadline ? deadline : 'Select Deadline'}
                  <CalendarDays className="ml-2" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
              <Calendar
                mode="single"
                selected={deadline ? new Date(new Date(deadline).getTime() + 24 * 60 * 60 * 1000) : undefined}
                onSelect={handleDateSelect}
              />
              </PopoverContent>
            </Popover>
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

          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="category">Category</label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full bg-white border border-[#BDBDBD]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((categoryOption) => (
                  <SelectItem key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </SelectItem>
                ))}
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
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalForm;
