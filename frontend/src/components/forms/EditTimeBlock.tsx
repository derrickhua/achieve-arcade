import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateTimeBlock, Task, TimeBlock as TimeBlockType } from '@/lib/dailySchedule';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';

interface EditTimeBlockFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchSchedule: () => Promise<void>;
  timeBlock: TimeBlockType;
}

const EditTimeBlockForm: React.FC<EditTimeBlockFormProps> = ({ isOpen, onClose, fetchSchedule, timeBlock }) => {
  const [name, setName] = useState(timeBlock.name);
  const [startTime, setStartTime] = useState(format(new Date(timeBlock.startTime), 'HH:mm'));
  const [endTime, setEndTime] = useState(format(new Date(timeBlock.endTime), 'HH:mm'));
  const [category, setCategory] = useState(timeBlock.category);
  const [tasks, setTasks] = useState<Task[]>(timeBlock.tasks);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const maxNameLength = 50;

  useEffect(() => {
    setName(timeBlock.name);
    setStartTime(format(new Date(timeBlock.startTime), 'HH:mm'));
    setEndTime(format(new Date(timeBlock.endTime), 'HH:mm'));
    setCategory(timeBlock.category);
    setTasks(timeBlock.tasks);
  }, [timeBlock]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxNameLength) {
      setName(e.target.value);
    }
  };

  const handleTaskChange = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { _id: new Date().getTime().toString(), name: '', completed: false, difficulty: 'Easy' }]);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
  };

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setShowAlert(true);
      setAlertMessage('Name is required.');
      isValid = false;
    }
    if (!startTime) {
      setShowAlert(true);
      setAlertMessage('Start time is required.');
      isValid = false;
    }
    if (!endTime) {
      setShowAlert(true);
      setAlertMessage('End time is required.');
      isValid = false;
    }
    if (!category) {
      setShowAlert(true);
      setAlertMessage('Category is required.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    const updateData = {
      name,
      startTime: new Date(`${currentDate}T${startTime}`),
      endTime: new Date(`${currentDate}T${endTime}`),
      tasks,
      category,
    };

    try {
      await updateTimeBlock(timeBlock._id, updateData);
      await fetchSchedule();
      setShowAlert(true);
      setAlertMessage('Time block updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update time block:', error);
      setShowAlert(true);
      setAlertMessage('Error updating time block. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">EDIT TIME BLOCK</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Edit your time block details here!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <Label htmlFor="name" className="block text-black text-[25px] mb-2">Name</Label>
            <Input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter block name"
              maxLength={maxNameLength}
              required
            />
            <div className="text-right text-[14px] text-[#BDBDBD]">
              {name.length}/{maxNameLength} characters
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="start-time" className="block text-black text-[25px] mb-2">Start Time</Label>
            <Input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="end-time" className="block text-black text-[25px] mb-2">End Time</Label>
            <Input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="category" className="block text-black text-[25px] mb-2">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full bg-white border border-[#BDBDBD]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="leisure">Leisure</SelectItem>
                <SelectItem value="family_friends">Family & Friends</SelectItem>
                <SelectItem value="atelic">Atelic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {category !== 'family_friends' && category !== 'atelic' && (
            <div className="mb-4 flex flex-col">
              <Label htmlFor="tasks" className="block text-black text-[25px] mb-2">Tasks</Label>
              {tasks.map((task, index) => (
                <div key={task._id} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="w-1/2 px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
                  />
                  <select
                    value={task.difficulty}
                    onChange={(e) => handleTaskChange(index, 'difficulty', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <Button type="button" onClick={() => handleRemoveTask(index)}>-</Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddTask} className="max-w-[185px] self-end bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px] flex-end">
                ADD TASK
              </Button>
            </div>
          )}
          {showAlert && (
            <Alert variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
              <AlertTitle>{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button type="submit" className="max-w-[185px] self-end bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px] flex-end">
              EDIT HABIT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTimeBlockForm;
