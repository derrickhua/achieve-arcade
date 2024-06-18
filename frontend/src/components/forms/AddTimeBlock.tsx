import React, { useState } from 'react';
import { addTimeBlock } from '@/lib/dailySchedule';

interface Task {
  name: string;
  difficulty: string;
}

interface TimeBlock {
  _id: string;
  name: string;
  startTime: Date; // Ensure this is Date type
  endTime: Date; // Ensure this is Date type
  tasks: Task[];
  category: string;
  completed: boolean;
}

interface AddTimeBlockFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchSchedule: () => Promise<void>;
  existingTimeBlocks: TimeBlock[];
}

const categoryOptions = [
  { value: 'work', label: 'Work' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'family_friends', label: 'Family & Friends' },
  { value: 'atelic', label: 'Atelic' },
];

const AddTimeBlockForm: React.FC<AddTimeBlockFormProps> = ({ isOpen, onClose, fetchSchedule, existingTimeBlocks }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('work');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const addTask = () => {
    setTasks([...tasks, { name: '', difficulty: 'Easy' }]);
  };

  const handleTaskChange = (index: number, field: keyof Task, value: string) => {
    const newTasks = tasks.slice();
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const isOverlapping = (newStart: Date, newEnd: Date) => {
    console.log('Checking new time block:', { newStart, newEnd });
  
    // Extract hours and minutes for normalization
    const normalizeTime = (date: Date) => ({
      hours: date.getHours(),
      minutes: date.getMinutes()
    });
  
    const { hours: newStartHours, minutes: newStartMinutes } = normalizeTime(newStart);
    const { hours: newEndHours, minutes: newEndMinutes } = normalizeTime(newEnd);
  
    return existingTimeBlocks.some(block => {
      const blockStart = new Date(block.startTime);
      const blockEnd = new Date(block.endTime);
  
      const { hours: blockStartHours, minutes: blockStartMinutes } = normalizeTime(blockStart);
      const { hours: blockEndHours, minutes: blockEndMinutes } = normalizeTime(blockEnd);
  
      const newStartTime = new Date(1970, 0, 1, newStartHours, newStartMinutes).getTime();
      const newEndTime = new Date(1970, 0, 1, newEndHours, newEndMinutes).getTime();
      const blockStartTime = new Date(1970, 0, 1, blockStartHours, blockStartMinutes).getTime();
      const blockEndTime = new Date(1970, 0, 1, blockEndHours, blockEndMinutes).getTime();
  
      console.log('Against existing block:', { blockStartTime, blockEndTime });
  
      const isOverlap = (
        (newStartTime < blockEndTime && newEndTime > blockStartTime) || // New block starts before existing block ends and ends after existing block starts
        (newStartTime >= blockStartTime && newStartTime < blockEndTime) || // New block starts within an existing block
        (newEndTime > blockStartTime && newEndTime <= blockEndTime) || // New block ends within an existing block
        (newStartTime <= blockStartTime && newEndTime >= blockEndTime) // New block encompasses an existing block
      );
  
      if (isOverlap) {
        console.log('Overlap detected');
      }
  
      return isOverlap;
    });
  };  
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const currentDate = new Date().toISOString().split('T')[0];
    const newStartTime = new Date(`${currentDate}T${startTime}`);
    const newEndTime = new Date(`${currentDate}T${endTime}`);
  
    console.log('New time block to be added:', { newStartTime, newEndTime });
  
    if (isOverlapping(newStartTime, newEndTime)) {
      setShowAlert(true);
      setAlertMessage('Time block overlaps with an existing time block. Please choose a different time.');
      return;
    }
  
    const newTimeBlock = {
      name,
      category,
      startTime: newStartTime,
      endTime: newEndTime,
      tasks,
      completed: false,
    };
  
    try {
      await addTimeBlock(newTimeBlock);
      await fetchSchedule();
      onClose();
    } catch (error) {
      setShowAlert(true);
      setAlertMessage('Error adding time block. Please try again.');
    }
  };  
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">ADD NEW TIME BLOCK</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Enter details about your new time block.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="name">Block Name</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter block name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="category">Category</label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {category !== 'family_friends' && category !== 'atelic' && (
            <div className="mb-4 flex flex-col">
              <label className="block text-black text-[25px] mb-2">Tasks</label>
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="w-1/2 px-3 py-2 border border-[#BDBDBD] rounded-lg"
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
                </div>
              ))}
              <button
                type="button"
                onClick={addTask}
                className="max-w-[185px] self-end bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px] flex-end"
              >
                Add Task
              </button>
            </div>
          )}

          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-black text-[25px] mb-2" htmlFor="start-time">Start Time</label>
              <input
                type="time"
                id="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-black text-[25px] mb-2" htmlFor="end-time">End Time</label>
              <input
                type="time"
                id="end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                required
              />
            </div>
          </div>

          {showAlert && (
            <div className="text-red-500 text-center">
              {alertMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
            >
              ADD TIME BLOCK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimeBlockForm;
