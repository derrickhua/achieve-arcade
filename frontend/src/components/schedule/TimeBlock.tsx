import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, Settings, Lock, Unlock, Expand, Circle, CheckCircle } from 'lucide-react';
import { deleteTimeBlock, updateTimeBlock } from '@/lib/dailySchedule';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { timeOptions, formatTimeForSelect, convertTo24HourFormat, toUTCString } from '@/lib/dateTimeUtil'; // Import utilities
import { Task, TimeBlock as TimeBlockType, DailySchedule } from '@/lib/dailySchedule';
import { debounce } from 'lodash';

interface TimeBlockProps {
  block: TimeBlockType;
  onUpdate: () => void;
  setSchedule: React.Dispatch<React.SetStateAction<DailySchedule>>;
}

const categoryColors = {
  work: 'bg-[#3B82F6]',
  leisure: 'bg-[#EF4444]',
  family_friends: 'bg-[#98E4A5]',
  atelic: 'bg-[#F4CB7E]',
};

const TimeBlock: React.FC<TimeBlockProps> = ({ block, onUpdate, setSchedule }) => {
  const colorClass = categoryColors[block.category] || 'bg-gray-500';
  const [isExpandOpen, setIsExpandOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [name, setName] = useState<string>(block.name);
  console.log('Initial Name:', block.name);
  const [startTime, setStartTime] = useState<string>(formatTimeForSelect(new Date(block.startTime)));
  console.log('Initial StartTime:', formatTimeForSelect(new Date(block.startTime)));
  const [endTime, setEndTime] = useState<string>(formatTimeForSelect(new Date(block.endTime)));
  console.log('Initial EndTime:', formatTimeForSelect(new Date(block.endTime)));
  const [tasks, setTasks] = useState<Task[]>(block.tasks || []);
  console.log('Initial Tasks:', block.tasks || []);
  
  const [isTimeBlockCompleted, setIsTimeBlockCompleted] = useState(block.completed);
  const allTasksComplete = (tasks && tasks.every(task => task.completed)) || (tasks && tasks.length === 0);

  const debouncedUpdate = debounce(async (block, updatedTasks, setSchedule) => {
    console.log('Debounced Update - Block:', block);
    console.log('Debounced Update - Updated Tasks:', updatedTasks);
    const updateData = {
      ...block,
      tasks: updatedTasks,
    };
    try {
      const updatedBlock = await updateTimeBlock(block._id, updateData);
  
      // Ensure the updated block data is as expected
      if (!updatedBlock._id || !updatedBlock.name || !updatedBlock.startTime || !updatedBlock.endTime) {
        console.error('Updated block is missing critical fields:', updatedBlock);
      }
  
      setSchedule(prevSchedule => {
        console.log('Previous Schedule:', prevSchedule);
        const updatedTimeBlocks = prevSchedule.timeBlocks.map(b =>
          b._id === block._id ? updatedBlock : b
        );
        return { ...prevSchedule, timeBlocks: updatedTimeBlocks };
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, 300);
  


  const handleExpandClick = () => {
    setIsExpandOpen(true);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseModal = () => {
    setIsExpandOpen(false);
    setIsSettingsOpen(false);
    setIsDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTimeBlock(block._id);
      onUpdate(); // Call the update function passed as a prop to refresh the schedule
    } catch (error) {
      console.error('Failed to delete time block:', error);
    }
    handleCloseModal();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentDate = new Date(block.startTime).toISOString().split('T')[0];
    const updateData = {
      name,
      startTime: new Date(toUTCString(currentDate, convertTo24HourFormat(startTime.trim()))),
      endTime: new Date(toUTCString(currentDate, convertTo24HourFormat(endTime.trim()))),
      tasks,
      category: block.category,
      completed: block.completed,
    };
  
    try {
      const updatedBlock = await updateTimeBlock(block._id, updateData);
  
      setSchedule(prevSchedule => {
        console.log('Previous Schedule:', prevSchedule);
        const updatedTimeBlocks = prevSchedule.timeBlocks.map(b =>
          b._id === block._id
            ? {
                ...b,
                name: updateData.name,
                startTime: updateData.startTime,
                endTime: updateData.endTime,
                tasks: updateData.tasks,
              }
            : b
        );
        console.log('Updated Time Blocks:', updatedTimeBlocks);
        return { ...prevSchedule, timeBlocks: updatedTimeBlocks };
      });
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update time block:', error);
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
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
  };

  const getTimeDifference = (start: string, end: string) => {
    const startIndex = timeOptions.indexOf(start);
    const endIndex = timeOptions.indexOf(end);
    return endIndex - startIndex;
  };

  const handleTaskToggle = (taskIndex: number) => {
    if (!tasks) return; // Early return if tasks is undefined
  
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, completed: !task.completed } : task
    );
  
    // Optimistically update the state
    setTasks(updatedTasks);
  
    // Call the debounced function with the updated tasks
    debouncedUpdate(block, updatedTasks, setSchedule);
  };
  
  const handleTimeBlockCompletion = async () => {
    const updatedBlock = { ...block, completed: !isTimeBlockCompleted };
    try {
      await updateTimeBlock(block._id, updatedBlock);
      setIsTimeBlockCompleted(!isTimeBlockCompleted);
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        timeBlocks: prevSchedule.timeBlocks.map(b =>
          b._id === block._id ? updatedBlock : b
        ),
      }));
    } catch (error) {
      console.error('Failed to update time block:', error);
    }
  };
  

  const timeDifference = getTimeDifference(startTime, endTime);
  const isSmall = timeDifference === 4;
  
  return (
    <>
      <div
        className={`time-block flex h-full flex-col justify-between p-2 rounded-lg relative ${colorClass} text-white ${isSmall ? 'small-timeblock' : ''}`}
      >
        <div className="flex space-x-1 absolute top-3 right-2">
          <button onClick={handleExpandClick} className="text-white">
            <Expand size={18} />
          </button>
          <button onClick={handleSettingsClick} className="text-white">
            <Settings size={18} />
          </button>
          <button onClick={handleDeleteClick} className="text-white">
            <X size={20} />
          </button>
        </div>
        <div className={`timeblock-labels ${isSmall ? 'row' : ''}`}>
          <span className="block-name font-bold text-center flex items-center gap-1">
              <p className='mt-1'>
                {block.name}
              </p>
              {isTimeBlockCompleted ? (
                <CheckCircle size={18} />
              ) : allTasksComplete ? (
                <input 
                  className='mt-1'
                  type="checkbox" 
                  checked={isTimeBlockCompleted} 
                  onChange={handleTimeBlockCompletion}
                />
              ) : (
                <Lock size={18} />
              )}
          </span>
          <div className="block-tasks flex items-center justify-center flex-wrap mt-2">
            {block.tasks && block.tasks.map((task, index) => (
              task.completed ? 
              <CheckCircle key={index} className="task-indicator w-4 h-4 text-white mx-1" /> :
              <Circle key={index} className="task-indicator w-4 h-4 text-white mx-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Expand Dialog */}
      <Dialog open={isExpandOpen} onOpenChange={setIsExpandOpen}>
        <DialogContent className={`dialog-content ${colorClass}`}>
          <DialogTitle className="dialog-title">
            <div className="flex justify-center items-center">
              <p className="font-bold mr-2">{block.name}</p>
              {block.completed ? <Lock size={18} /> : <Unlock size={18} />}
            </div>
          </DialogTitle>
          <div className="flex justify-between mb-4 text-[15px]">
            <span>start: {startTime}</span>
            <span>end: {endTime}</span>
          </div>
          <div className="dialog-tasks">
            {block.tasks && block.tasks.map((task, index) => (
              <div
                key={index}
                className="dialog-task flex items-center justify-between p-2 rounded border border-white"
                onClick={() => handleTaskToggle(index)}
              >
                <span>{task.name}</span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(index)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogTitle>Edit {block.name}</DialogTitle>
          <form className="space-y-4" onSubmit={handleSave}>
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
              <Label htmlFor="start-time" className="mt-2">Start Time</Label>
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
              <Label htmlFor="end-time" className="mt-2">End Time</Label>
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
              <Label htmlFor="tasks" className="mt-2">Tasks</Label>
              {tasks && tasks.map((task, index) => (
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
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2 mr-2">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogTitle>Delete {block.name}?</DialogTitle>
          <p>Are you sure you want to delete this time block?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2 mr-2">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimeBlock;
