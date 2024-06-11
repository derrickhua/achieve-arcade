import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateTimeBlock } from '@/lib/dailySchedule';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

interface TimeBlock {
  _id: string;
  name: string;
  category: 'work' | 'leisure' | 'family_friends' | 'atelic';
  startTime: string;
  endTime: string;
  tasks: Task[];
  completed: boolean;
  timerDuration?: number;
}

interface ExpandTimeBlockProps {
  block: TimeBlock;
  isOpen: boolean;
  onClose: () => void;
  startTimer: boolean;
  fetchSchedule: () => Promise<void>;
}

const categoryColors: { [key: string]: string } = {
  work: 'bg-[#b82c05]',
  leisure: 'bg-[#73926d]',
  family_friends: 'bg-[#efbf7b]',
  atelic: 'bg-[#a3bdb6]',
};

const ExpandTimeBlock: React.FC<ExpandTimeBlockProps> = ({
  block,
  isOpen,
  onClose,
  startTimer,
  fetchSchedule,
}) => {
  const [colorClass, setColorClass] = useState('');
  const [timerDuration, setTimerDuration] = useState(block.timerDuration || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(startTimer);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(block.tasks);

  useEffect(() => {
    setColorClass(categoryColors[block.category] || 'bg-gray-500');
  }, [block.category]);

  useEffect(() => {
    if (startTimer) {
      setIsTimerRunning(true);
    }
  }, [startTimer]);

  useEffect(() => {
    if (isTimerRunning && !intervalId) {
      const id = setInterval(() => {
        setTimerDuration(prevDuration => prevDuration + 1);
      }, 1000);
      setIntervalId(id);
    } else if (!isTimerRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => clearInterval(intervalId as NodeJS.Timeout);
  }, [isTimerRunning, intervalId]);

  useEffect(() => {
    setLocalTasks(block.tasks);  // Synchronize localTasks with the block.tasks whenever the block prop updates
  }, [block.tasks]);

  const handleTimerStart = () => {
    setIsTimerRunning(true);
  };

  const handleTimerPause = () => {
    setIsTimerRunning(false);
  };

  const handleTimerEnd = async () => {
    setIsTimerRunning(false);
    try {
      const updatedBlock = { ...block, timerDuration };
      await updateTimeBlock(block._id, updatedBlock);
      await fetchSchedule();
    } catch (error) {
      console.error('Failed to update timer duration:', error);
    }
  };

  const handleCompleteToggle = async () => {
    const updatedBlock = { ...block, completed: !block.completed };
    try {
      await updateTimeBlock(block._id, updatedBlock);
      await fetchSchedule();
    } catch (error) {
      console.error('Failed to update time block:', error);
    }
  };

  const handleTaskToggle = async (index: number) => {
    const updatedTasks = localTasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);
    const updatedBlock = { ...block, tasks: updatedTasks };
    try {
      await updateTimeBlock(block._id, updatedBlock);
      await fetchSchedule();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`dialog-content ${colorClass} text-[#FEFDF2]`}>
        <DialogTitle className="dialog-title">
          <div className="flex justify-center items-center">
            <p className="text-[40px] mr-2">{block.name}</p>
            {
              (block.tasks.length === 0) &&
              <input
                type="checkbox"
                checked={block.completed}
                onChange={handleCompleteToggle}
                className="text-[#FEFDF2] border-black"
              />
            }
          </div>
        </DialogTitle>
        <div className="flex justify-center items-center mb-4">
          <span className="text-[50px]">{`${Math.floor(timerDuration / 3600)
            .toString()
            .padStart(2, '0')}:${Math.floor((timerDuration % 3600) / 60)
            .toString()
            .padStart(2, '0')}:${(timerDuration % 60).toString().padStart(2, '0')}`}</span>
        </div>
        <div className="flex justify-center items-center mb-4">
          {isTimerRunning ? (
            <>
              <Button
                onClick={handleTimerPause}
                className="h-[50px] w-[150px] text-[20px] bg-transparent hover:bg-[#FEFDF2] hover:text-transparent text-[#FEFDF2] border-[4px] border-[#FEFDF2] rounded px-4 py-2 mr-2"
              >
                PAUSE TIMER
              </Button>
              <Button
                onClick={handleTimerEnd}
                className="h-[50px] w-[150px] text-[20px] bg-transparent hover:bg-[#FEFDF2] hover:text-transparent text-[#FEFDF2] border-[4px] border-[#FEFDF2] rounded px-4 py-2"
              >
                END TIMER
              </Button>
            </>
          ) : (
            <Button
              onClick={handleTimerStart}
              className="h-[50px] w-[150px] text-[20px] bg-transparent hover:bg-[#FEFDF2] hover:text-transparent text-[#FEFDF2] border-[4px] border-[#FEFDF2] rounded px-4 py-2"
            >
              START TIMER
            </Button>
          )}
        </div>
        <div className="dialog-tasks grid grid-cols-2 gap-2 w-full px-2">
          {localTasks && localTasks.map((task, index) => (
            <div
              key={index}
              className="text-[20px] px-4 dialog-task flex items-center justify-between p-2 rounded-xl border border-[#FEFDF2] border-[4px] mb-2"
            >
              <span>{task.name}</span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(index)}
                className={`rounded bg-[#FEFDF2] border-[#FEFDF2] ${task.completed ? 'text-black' : ''}`}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandTimeBlock;
