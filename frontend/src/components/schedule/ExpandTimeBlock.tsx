import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateTimeBlock } from '@/lib/dailySchedule';
import { CheckCircle, Circle, Lock, Unlock } from 'lucide-react';

interface Task {
  name: string;
  completed: boolean;
}

interface DailySchedule {
    timeBlocks: TimeBlock[];
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
  setSchedule: React.Dispatch<React.SetStateAction<DailySchedule>>;
  startTimer: boolean;
}

const categoryColors: { [key in TimeBlock['category']]: string } = {
  work: 'bg-[#3B82F6]',
  leisure: 'bg-[#EF4444]',
  family_friends: 'bg-[#98E4A5]',
  atelic: 'bg-[#F4CB7E]',
};

const ExpandTimeBlock: React.FC<ExpandTimeBlockProps> = ({
  block,
  isOpen,
  onClose,
  setSchedule,
  startTimer,
}) => {
  const [colorClass, setColorClass] = useState('');
  const [timerDuration, setTimerDuration] = useState(block.timerDuration || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(startTimer);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const categoryColors: { [key: string]: string } = {
      work: 'bg-[#3B82F6]',
      leisure: 'bg-[#EF4444]',
      family_friends: 'bg-[#98E4A5]',
      atelic: 'bg-[#F4CB7E]',
    };
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

  const handleTimerStart = () => {
    setIsTimerRunning(true);
  };

  const handleTimerStop = async () => {
    setIsTimerRunning(false);
    try {
      const updatedBlock = { ...block, timerDuration };
      console.log(updatedBlock)
      await updateTimeBlock(block._id, updatedBlock);
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        timeBlocks: prevSchedule.timeBlocks.map(b => (b._id === block._id ? updatedBlock : b)),
      }));
    } catch (error) {
      console.error('Failed to update timer duration:', error);
    }
  };

  const handleCompleteToggle = async () => {
    const updatedBlock = { ...block, completed: !block.completed };
    try {
      await updateTimeBlock(block._id, updatedBlock);
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        timeBlocks: prevSchedule.timeBlocks.map(b => (b._id === block._id ? updatedBlock : b)),
      }));
    } catch (error) {
      console.error('Failed to update time block:', error);
    }
  };

  const handleTaskToggle = async (index: number) => {
    console.log('this is happening');
    const updatedTasks = block.tasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed } : task
    );
    const updatedBlock = { ...block, tasks: updatedTasks };
    try {
      await updateTimeBlock(block._id, updatedBlock);
      setSchedule((prevSchedule: DailySchedule) => ({
        ...prevSchedule,
        timeBlocks: prevSchedule.timeBlocks.map(b => (b._id === block._id ? updatedBlock : b)),
      }));
      console.log('updated block:', updatedBlock);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`dialog-content ${colorClass}`}>
        <DialogTitle className="dialog-title">
          <div className="flex justify-center items-center">
            <p className="font-bold mr-2">{block.name}</p>
            <input
              type="checkbox"
              checked={block.completed}
              onChange={handleCompleteToggle}
            />
          </div>
        </DialogTitle>
        <div className="flex justify-center items-center mb-4">
          <span className="text-[50px] font-bold">{`${Math.floor(timerDuration / 3600)
            .toString()
            .padStart(2, '0')}:${Math.floor((timerDuration % 3600) / 60)
            .toString()
            .padStart(2, '0')}:${(timerDuration % 60).toString().padStart(2, '0')}`}</span>
        </div>
        {isTimerRunning ? (
          <div className="flex justify-center items-center mb-4">
            <Button onClick={handleTimerStop} className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
              Stop Timer
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center mb-4">
            <Button onClick={handleTimerStart} className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
              Start Timer
            </Button>
          </div>
        )}
        <div className="dialog-tasks">
          {block.tasks && block.tasks.map((task, index) => (
            <div
              key={index}
              className="dialog-task flex items-center justify-between p-2 rounded border border-white"
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
  );
};

export default ExpandTimeBlock;
