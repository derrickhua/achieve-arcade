import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateTimeBlock, Task, TimeBlock as TimeBlockType } from '@/lib/dailySchedule';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { format, parseISO } from 'date-fns';

interface EditTimeBlockFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchSchedule: () => Promise<void>;
  timeBlock: TimeBlockType;
}

const EditTimeBlockForm: React.FC<EditTimeBlockFormProps> = ({ isOpen, onClose, fetchSchedule, timeBlock }) => {
  const [name, setName] = useState(timeBlock.name);
  const [startTime, setStartTime] = useState(format(parseISO(timeBlock.startTime), 'HH:mm'));
  const [endTime, setEndTime] = useState(format(parseISO(timeBlock.endTime), 'HH:mm'));
  const [category, setCategory] = useState(timeBlock.category);
  const [tasks, setTasks] = useState<Task[]>(timeBlock.tasks);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const maxNameLength = 50;

  useEffect(() => {
    setName(timeBlock.name);
    setStartTime(format(parseISO(timeBlock.startTime), 'HH:mm'));
    setEndTime(format(parseISO(timeBlock.endTime), 'HH:mm'));
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
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!name) {
      setShowAlert(true);
      setAlertMessage('Name is required.');
      isValid = false;
    }
    if (!startTime || !timeRegex.test(startTime)) {
      setShowAlert(true);
      setAlertMessage('Start time is required and must be in the format HH:mm.');
      isValid = false;
    }
    if (!endTime || !timeRegex.test(endTime)) {
      setShowAlert(true);
      setAlertMessage('End time is required and must be in the format HH:mm.');
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

    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}:00`;
    };

    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    const updateData = {
      name,
      startTime: new Date(`${currentDate}T${parseTime(startTime)}`),
      endTime: new Date(`${currentDate}T${parseTime(endTime)}`),
      tasks,
      category,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Add the timezone here
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
      <div className="bg-[#FEFDF2] rounded-xl p-4 md:p-8 relative w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[30px] md:text-[40px] mr-4">EDIT TIME BLOCK</h2>
        <p className="text-[#BDBDBD] mb-4 text-[16px] md:text-[20px]">Edit your time block details here!</p>

        <form onSubmit={handleSubmit} className="md:space-y-4">
          <div className="md:mb-4">
            <Label htmlFor="name" className="block text-black text-[20px] md:text-[25px] mb-2">Name</Label>
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
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="w-full md:w-1/2 md:pr-2">
              <Label htmlFor="start-time" className="block text-black text-[20px] md:text-[25px] mb-2">Start Time</Label>
              <div className="relative">
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <input
                  type="time"
                  id="start-time"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min="00:00"
                  max="24:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-2 mt-4 md:mt-0">
              <Label htmlFor="end-time" className="block text-black text-[20px] md:text-[25px] mb-2">End Time</Label>
              <div className="relative">
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <input
                  type="time"
                  id="end-time"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min="00:00"
                  max="24:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="category" className="block text-black text-[20px] md:text-[25px] mb-2">Category</Label>
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
            <div className="mb-4 flex flex-col max-h-[300px] md:max-h-[400px] overflow-y-auto">
              <Label htmlFor="tasks" className="block text-black text-[20px] md:text-[25px] mb-2">Tasks</Label>
                {tasks.map((task, index) => (
                <div key={task._id} className="flex flex-row items-center space-x-0 md:space-x-2 mb-2 gap-2 md:gap-0">
                  <Input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="w-full md:w-1/2 px-3 py-2 mr-2 md:mr-0 border border-[#BDBDBD] rounded-lg bg-white"
                  />
                  <select
                    value={task.difficulty}
                    onChange={(e) => handleTaskChange(index, 'difficulty', e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 mr-4 border border-[#BDBDBD] rounded-lg bg-white"
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
              <AlertTitle className="text-[16px] md:text-[20px]">{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription className="text-[14px] md:text-[16px]">
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end mt-4">
            <Button type="submit" className="w-full md:max-w-[185px] bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[16px] md:text-[20px] flex-end">
              SAVE TIME BLOCK
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTimeBlockForm;
