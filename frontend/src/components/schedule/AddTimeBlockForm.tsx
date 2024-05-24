import React, { useState, useEffect } from 'react';
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
  '1:00 AM', '1:15 AM', '1:30 AM', '1:45 AM',
  '2:00 AM', '2:15 AM', '2:30 AM', '2:45 AM',
  '3:00 AM', '3:15 AM', '3:30 AM', '3:45 AM',
  '4:00 AM', '4:15 AM', '4:30 AM', '4:45 AM',
  '5:00 AM', '5:15 AM', '5:30 AM', '5:45 AM',
  '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM',
  '7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM',
  '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM',
  '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
  '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
  '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
  '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM',
  '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
  '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM',
  '8:00 PM', '8:15 PM', '8:30 PM', '8:45 PM',
  '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM',
  '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM',
  '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM',
];

const getClosestTimeSlot = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const closestMinutes = Math.round(minutes / 15) * 15;
  now.setMinutes(closestMinutes, 0, 0);
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedTime = `${hours}:${now.getMinutes().toString().padStart(2, '0')} ${ampm}`;

  return timeOptions.find(time => time === formattedTime) || timeOptions[0];
};

const AddTimeBlockForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState([{ name: '', completed: false }]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('work');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !startTime || !endTime || !category) {
      setShowAlert(true);
      setAlertMessage('Please fill in all required fields.');
      return;
    }

    const newTimeBlock = {
      name,
      tasks: category === 'work' || category === 'leisure' ? tasks : [],
      startTime: new Date(`1970-01-01T${convertTo24HourFormat(startTime)}:00`),
      endTime: new Date(`1970-01-01T${convertTo24HourFormat(endTime)}:00`),
      category,
      completed: false
    };

    onAdd(newTimeBlock);
    setName('');
    setTasks([{ name: '', completed: false }]);
    const initialStartTime = getClosestTimeSlot();
    setStartTime(initialStartTime);
    const startIndex = timeOptions.indexOf(initialStartTime);
    const endIndex = (startIndex + 4) % timeOptions.length;
    setEndTime(timeOptions[endIndex]);
    setCategory('work');
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
    const [hours, minutes] = time.slice(0, -2).split(':');
    const period = time.slice(-2);
    let adjustedHours = parseInt(hours, 10);
    if (period === 'PM' && adjustedHours !== 12) {
      adjustedHours += 12;
    } else if (period === 'AM' && adjustedHours === 12) {
      adjustedHours = 0;
    }
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes}`;
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
