import React, { useState, useEffect } from 'react';
import { addTimeBlock } from '@/lib/dailySchedule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { timeOptions, getClosestTimeSlot, convertTo24HourFormat, toUTCString } from '@/lib/dateTimeUtil';

interface Task {
  name: string;
  completed: boolean;
}

interface AddTimeBlockFormProps {
  onAdd: (updatedSchedule: any) => void;
}

const categories = [
  { value: 'work', label: 'Work' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'family_friends', label: 'Family & Friends' },
  { value: 'atelic', label: 'Atelic' }
];

const AddTimeBlockForm: React.FC<AddTimeBlockFormProps> = ({ onAdd }) => {
  const [name, setName] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [category, setCategory] = useState<string>('work');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    const initialStartTime = getClosestTimeSlot();
    setStartTime(initialStartTime);
    const startIndex = timeOptions.indexOf(initialStartTime);
    const endIndex = (startIndex + 4) % timeOptions.length;
    setEndTime(timeOptions[endIndex]);
  }, []);

  useEffect(() => {
    const startIndex = timeOptions.indexOf(startTime);
    const endIndex = (startIndex + 4) % timeOptions.length;
    setEndTime(timeOptions[endIndex]);
  }, [startTime]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!name || !startTime || !endTime || !category) {
      setShowAlert(true);
      setAlertMessage('Please fill in all required fields.');
      return;
    }
  
    const currentDate = new Date().toISOString().split('T')[0];
  
    const newTimeBlock = {
      name,
      tasks: category === 'work' || category === 'leisure' ? tasks : [],
      startTime: new Date(toUTCString(currentDate, convertTo24HourFormat(startTime.trim()))),
      endTime: new Date(toUTCString(currentDate, convertTo24HourFormat(endTime.trim()))),
      category,
      completed: false
    };
  
    try {
      console.log(newTimeBlock);
      const updatedSchedule = await addTimeBlock(newTimeBlock);
      onAdd(updatedSchedule);
      setName('');
      setTasks([]);
      const initialStartTime = getClosestTimeSlot();
      setStartTime(initialStartTime);
      const startIndex = timeOptions.indexOf(initialStartTime);
      const endIndex = (startIndex + 4) % timeOptions.length;
      setEndTime(timeOptions[endIndex]);
      setCategory('work');
      setShowAlert(false);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage('Failed to add time block.');
    }
  };
  

  const handleTaskChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newTasks = [...tasks];
    newTasks[index].name = event.target.value;
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { name: '', completed: false }]);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Time Block</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Time Block</DialogTitle>
          <DialogDescription>Enter details about your new time block.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Block Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter block name"
              required
            />
            <Label htmlFor="category" className="mt-2">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {(category !== 'family_friends' && category !== 'atelic') && (
              <>
                <Label htmlFor="tasks" className="mt-2">Tasks</Label>
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={task.name}
                      onChange={(e) => handleTaskChange(index, e)}
                      placeholder={`Task ${index + 1}`}
                    />
                    <Button type="button" onClick={() => handleRemoveTask(index)}>-</Button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddTask}>Add Task</Button>
              </>
            )}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <select
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <select
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Time Block</Button>
          </DialogFooter>
        </form>
        {showAlert && (
          <div className="mt-4 text-red-500 text-center">
            {alertMessage}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddTimeBlockForm;
