'use client';
import React, { useState } from 'react';
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

const categories = [
  { value: 'work', label: 'Work' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'family_friends', label: 'Family & Friends' },
  { value: 'atelic', label: 'Atelic' }
];

const timeOptions = [
  '12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM',
  '01:00 AM', '01:15 AM', '01:30 AM', '01:45 AM',
  '02:00 AM', '02:15 AM', '02:30 AM', '02:45 AM',
  '03:00 AM', '03:15 AM', '03:30 AM', '03:45 AM',
  '04:00 AM', '04:15 AM', '04:30 AM', '04:45 AM',
  '05:00 AM', '05:15 AM', '05:30 AM', '05:45 AM',
  '06:00 AM', '06:15 AM', '06:30 AM', '06:45 AM',
  '07:00 AM', '07:15 AM', '07:30 AM', '07:45 AM',
  '08:00 AM', '08:15 AM', '08:30 AM', '08:45 AM',
  '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM',
  '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
  '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
  '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
  '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM',
  '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM',
  '07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM',
  '08:00 PM', '08:15 PM', '08:30 PM', '08:45 PM',
  '09:00 PM', '09:15 PM', '09:30 PM', '09:45 PM',
  '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM',
  '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM',
];

const getClosestTimeSlot = (offset = 0) => {
  const now = new Date();
  const minutes = now.getMinutes();
  const closestMinutes = Math.round(minutes / 15) * 15;
  now.setMinutes(closestMinutes + offset);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const AddTimeBlockForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState([{ name: '', completed: false }]);
  const [startTime, setStartTime] = useState(getClosestTimeSlot());
  const [endTime, setEndTime] = useState(getClosestTimeSlot(60));
  const [category, setCategory] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !startTime || !endTime || !category) {
      setShowAlert(true);
      console.log(name, startTime, endTime, category)
      setAlertMessage('Please fill in all required fields.');
      return;
    }

    const newTimeBlock = {
      name,
      tasks,
      startTime: new Date(`1970-01-01T${convertTo24HourFormat(startTime)}:00`),
      endTime: new Date(`1970-01-01T${convertTo24HourFormat(endTime)}:00`),
      category,
      completed: false
    };

    onAdd(newTimeBlock);
    setName('');
    setTasks([{ name: '', completed: false }]);
    setStartTime(getClosestTimeSlot());
    setEndTime(getClosestTimeSlot(60));
    setCategory('');
    setShowAlert(false);
  };

  const handleTaskChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index].name = event.target.value;
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { name: '', completed: false }]);
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
  };

  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(':');
    let period = time.slice(-2);
    let adjustedHours = parseInt(hours, 10);
    if (period === 'PM' && adjustedHours !== 12) {
      adjustedHours += 12;
    } else if (period === 'AM' && adjustedHours === 12) {
      adjustedHours = 0;
    }
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.slice(0, 2)}`;
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