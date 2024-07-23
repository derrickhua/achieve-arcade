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
  
  const convertToISOWithOffset = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result.toISOString();
  };

  const isOverlapping = (newStart: Date, newEnd: Date) => {
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
  
      return (
        (newStartTime < blockEndTime && newEndTime > blockStartTime) ||
        (newStartTime >= blockStartTime && newStartTime < blockEndTime) ||
        (newEndTime > blockStartTime && newEndTime <= blockEndTime) ||
        (newStartTime <= blockStartTime && newEndTime >= blockEndTime)
      );
    });
  };
  
  const validateTime = (time: string) => {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(time);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!validateTime(startTime) || !validateTime(endTime)) {
    setShowAlert(true);
    setAlertMessage('Invalid time format. Please use HH:MM format.');
    return;
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ensure the date part is today's date

  const newStartTime = convertToISOWithOffset(currentDate, startTime);
  const newEndTime = convertToISOWithOffset(currentDate, endTime);

  if (isOverlapping(new Date(newStartTime), new Date(newEndTime))) {
    setShowAlert(true);
    setAlertMessage('Time block overlaps with an existing time block. Please choose a different time.');
    return;
  }

  const newTimeBlock = {
    name,
    category,
    startTime: new Date(newStartTime),
    endTime: new Date(newEndTime),
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto" onClick={onClose}>
        <div className="bg-[#FEFDF2] rounded-xl p-4 md:p-8 relative w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[20px] md:text-[30px] mr-4">ADD NEW TIME BLOCK</h2>
        <p className="text-[#BDBDBD] mb-4 text-[16px] md:text-[20px]">Enter details about your new time block.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-black text-[18px] md:text-[25px] mb-2" htmlFor="name">Block Name</label>
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
            <label className="block text-black text-[18px] md:text-[25px] mb-2" htmlFor="category">Category</label>
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
              <label className="block text-black text-[18px] md:text-[25px] mb-2">Tasks</label>
              {tasks.map((task, index) => (
                <div key={index} className="flex  flex-row items-center  md:space-y-0 md:space-x-2 mb-2">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="w-full md:w-1/2 px-3 py-1 border border-[#BDBDBD] rounded-lg mr-2"
                  />
                  <select
                    value={task.difficulty}
                    onChange={(e) => handleTaskChange(index, 'difficulty', e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
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
                className="max-w-[185px] self-end bg-black text-white px-4 md:py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[18px] flex-end"
              >
                ADD TASK
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="w-full md:w-1/2 md:pr-2">
              <label className="block text-black text-[20px] md:text-[25px] mb-2" htmlFor="start-time">Start Time</label>
              <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <input
                  type="time"
                  id="start-time"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-500 focus:border-blue-500 block
                  w-full p-2.5  dark:placeholder
                  -gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min="00:00"
                  max="24:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-2 mt-4 md:mt-0">
              <label className="block text-black text-[20px] md:text-[25px] mb-2" htmlFor="end-time">End Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <input
                  type="time"
                  id="end-time"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                   dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                    dark:focus:border-blue-500"
                  min="00:00"
                  max="24:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
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
              className="bg-black text-white px-4 md:py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
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
