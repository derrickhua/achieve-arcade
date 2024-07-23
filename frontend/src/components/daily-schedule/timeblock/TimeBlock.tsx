import React, { useState, useEffect } from 'react';
import { X, Bolt, Circle, Clock } from 'lucide-react';
import { updateTimeBlock } from '@/lib/dailySchedule';
import { TimeBlock as TimeBlockType } from '@/lib/dailySchedule';
import ExpandTimeBlock from './ExpandTimeBlock';

interface TimeBlockProps {
  block: TimeBlockType;
  onUpdate: () => void;
  onEdit: (timeBlock: TimeBlockType) => void;
  onDelete: (timeBlock: TimeBlockType) => void;
  fetchSchedule: () => void;
}

const categoryColors: { [key: string]: string } = {
  work: 'bg-[#b82c05]',
  leisure: 'bg-[#73926d]',
  family_friends: 'bg-[#efbf7b]',
  atelic: 'bg-[#a3bdb6]',
};

const TimeBlock: React.FC<TimeBlockProps> = ({ block, onEdit, onDelete, fetchSchedule }) => {
  const colorClass = categoryColors[block.category] || 'bg-gray-500';
  const [isExpandOpen, setIsExpandOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeBlockCompleted, setIsTimeBlockCompleted] = useState(block.completed);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleExpandClick = () => {
    setIsExpandOpen(true);
  };

  const handleSettingsClick = () => {
    onEdit(block);
  };

  const handleDeleteClick = () => {
    onDelete(block);
  };

  const handleCloseModal = () => {
    setIsExpandOpen(false);
  };

  const handleTimeBlockCompletion = async () => {
    const updatedBlock = { ...block, completed: !isTimeBlockCompleted };
    try {
      await updateTimeBlock(block._id, updatedBlock);
      setIsTimeBlockCompleted(!isTimeBlockCompleted);
      fetchSchedule();
    } catch (error) {
      console.error('Failed to update time block:', error);
    }
  };

  const timeDifference = (new Date(block.endTime).getTime() - new Date(block.startTime).getTime()) / 3600000;
  const isSmall = timeDifference <= 1;

  return (
    <>
      <div
        className={`time-block flex h-full flex-col justify-between p-2 rounded-lg relative ${colorClass} text-[#FEFDF2] ${isSmall ? 'small-timeblock' : ''}`}
      >
        <div className="absolute top-[2px] right-2 flex items-center space-x-1 md:top-3">
          <button onClick={handleExpandClick} className="text-[#FEFDF2] flex items-center justify-center">
            <Clock size={18} />
          </button>
          <button onClick={handleSettingsClick} className="text-[#FEFDF2] flex items-center justify-center">
            <Bolt size={18} />
          </button>
          <button onClick={handleDeleteClick} className="text-[#FEFDF2] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
        <div className={`timeblock-labels flex h-full ${isSmall ? 'flex-row items-center' : 'flex-col justify-center'}`}>
          <span className={`block-name ${isSmall ? '' : 'justify-center '} text-center flex items-center gap-1`}>
            <p className={`mt-1 text-[15px] ${isSmall ? 'mr-2 ml-2 md:text-[30px]' : 'md:text-[30px]'}`}>
              {block.name}
            </p>
            {block.tasks.length === 0 && (
              <input
                type="checkbox"
                checked={isTimeBlockCompleted}
                onChange={handleTimeBlockCompletion}
                className={`rounded ${isTimeBlockCompleted ? 'text-black' : ''}`}
              />
            )}
          </span>
          <div className={`block-tasks flex items-center justify-center flex-wrap ${isSmall ? '' : 'md:mt-2'}`}>
            {block.tasks && block.tasks.map((task, index) => (
              <Circle key={task._id} strokeWidth={3} className={`task-indicator h-4 w-4 md:w-6 md:h-6 text-[#FEFDF2] mx-1 ${task.completed ? 'bg-white rounded-xl' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      <ExpandTimeBlock
        block={block}
        isOpen={isExpandOpen}
        onClose={() => setIsExpandOpen(false)}
        fetchSchedule={fetchSchedule}
        startTimer={isTimerRunning}
      />
    </>
  );
};

export default TimeBlock;
