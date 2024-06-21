import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addTask } from '@/lib/task';

interface Task {
  name: string;
  difficulty: string;
}

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchTasks: () => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ isOpen, onClose, fetchTasks }) => {
  const [name, setName] = useState('');
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

    const taskData: Task = {
      name,
      difficulty,
    };

    try {
      await addTask(taskData);
      await fetchTasks();
      setName('');
      setDifficulty('Medium');
      setShowAlert(true);
      setAlertMessage('Task added successfully!');
      onClose();
    } catch (error: any) {
      console.error('Failed to create task:', error);
      setShowAlert(true);
      setAlertMessage(error.message || 'Error adding task. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">ADD NEW TASK</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Enter your task details here!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="name">Name</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter task name"
              maxLength={maxNameLength}
              required
            />
            <div className="text-right text-[14px] text-[#BDBDBD]">
              {name.length}/{maxNameLength} characters
            </div>
          </div>
          <div className="">
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
              ADD TASK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
