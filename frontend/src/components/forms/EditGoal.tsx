import React, { useState, useEffect } from 'react';
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
import { updateGoal, getAllGoals, Goal } from '@/lib/goals';

interface EditGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchGoals: () => Promise<void>;
  goal: Goal; // The goal to edit
}

const EditGoalForm: React.FC<EditGoalFormProps> = ({ isOpen, onClose, fetchGoals, goal }) => {
    const [title, setTitle] = useState(goal.title || '');
    const [description, setDescription] = useState(goal.description || '');
    const [deadline, setDeadline] = useState(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');
    const [category, setCategory] = useState(goal.category || '');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [difficulty, setDifficulty] = useState(goal.difficulty || 'Medium');
  
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
    
    const handleDateSelect = (date: Date | undefined) => {
      console.log('initial',  date)
      if (date) {
        setDeadline(date.toISOString().split('T')[0]);
        console.log('after change', date.toISOString().split('T')[0])

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
      return isValid;
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!validateForm()) {
        return;
      }
  
      const updateData = {
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        category,
        difficulty,
      };
  
      try {
        await updateGoal(goal._id, updateData);
        await fetchGoals();
        setShowAlert(true);
        setAlertMessage('Goal updated successfully!');
        onClose();
      } catch (error) {
        console.error('Failed to update goal:', error);
        setShowAlert(true);
        setAlertMessage('Error updating goal. Please try again.');
      }
    };
  
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">EDIT GOAL</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Update your goal details here!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="title">Goal Title</label>
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
            <div className="text-right text-[14px] text-[#BDBDBD]">
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
            />
            <div className="text-right text-[14px] text-[#BDBDBD]">
              {description.length}/{maxDescriptionLength} characters
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="deadline">Deadline</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-white w-full px-3 py-2 border border-[#BDBDBD] rounded-lg flex items-center justify-between">
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
              <SelectTrigger className="w-full bg-white border border-[#BDBDBD]">
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
              Update Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalForm;
