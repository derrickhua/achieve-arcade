import React, { useState, useEffect, useRef } from 'react';
import { getDailySchedule, addTimeBlock, updateTimeBlock, getWeeklyHours } from '@/lib/dailySchedule';
import TimeBlock from './TimeBlock';
import AddTimeBlockForm from './AddTimeBlockForm';
import { format, setHours, setMinutes } from 'date-fns';
import './schedule.css';
import { getUserProfile } from '@/lib/user';
import WeeklyHoursSummary from './WeeklyHoursSummary';

export interface Task {
  name: string;
  completed: boolean;
}

export interface TimeBlock {
  _id: string;
  name: string;
  category: string;
  startTime: string;
  endTime: string;
  tasks: Task[];
  completed: boolean;
}

export interface DailySchedule {
  timeBlocks: TimeBlock[];
}

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hourSlot = { time: setHours(setMinutes(new Date(), 0), i), label: true };
    const halfHourSlot = { time: setHours(setMinutes(new Date(), 30), i), label: false };
    slots.push(hourSlot, halfHourSlot);
  }
  return slots;
};

const getBlockPosition = (startTime: Date) => {
  const start = new Date(startTime);
  return ((start.getHours() * 60 + start.getMinutes()) / 1440) * 100; // percentage of the day
};

const getBlockHeight = (startTime: Date, endTime: Date) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return ((end.getTime() - start.getTime()) / 3600000) * (100 / 24); // percentage of the day based on hour height
};

const getCurrentTimePosition = () => {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const percentageOfDay = (totalMinutes / 1440) * 100; // Calculate the percentage of the day
  return percentageOfDay;
};

const getColorByCategory = (category: string) => {
  switch (category) {
    case 'leisure':
      return '#EF4444';
    case 'family_friends':
      return '#98E4A5';
    case 'work':
      return '#3B82F6';
    case 'atelic':
      return '#F4CB7E';
    default:
      return '#ffffff';
  }
};

export default function DailySchedule() {
  const [schedule, setSchedule] = useState<DailySchedule>({ timeBlocks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const timeSlots = generateTimeSlots();
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState(null);
  const [weeklyHours, setWeeklyHours] = useState(null)
  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(() => {
      if (currentTimeRef.current) {
        const position = getCurrentTimePosition();
        currentTimeRef.current.style.top = `${position}%`;
      }
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const fetchWeeklyHours = async () => {
      try {
        const date = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
        const data = await getWeeklyHours(date);
        setWeeklyHours(data);
      } catch (error) {
        console.error('Error fetching weekly hours by category:', error);
      }
    };

    fetchWeeklyHours();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const response:DailySchedule = await getDailySchedule();
      setSchedule(response || { timeBlocks: [] });
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch daily schedule.');
      setIsLoading(false);
    }
  };

  const handleTaskComplete = async (blockId: string, taskId: string) => {
    try {
      const updatedBlock = schedule.timeBlocks.find((block) => block._id === blockId);
      if (updatedBlock) {
        updatedBlock.tasks = updatedBlock.tasks.map((task) =>
          task._id === taskId ? { ...task, completed: !task.completed } : task
        );
        await updateTimeBlock(blockId, { tasks: updatedBlock.tasks });
        setSchedule({
          ...schedule,
          timeBlocks: schedule.timeBlocks.map((block) =>
            block._id === blockId ? updatedBlock : block
          ),
        });
      }
    } catch (error) {
      setError('Failed to update task.');
    }
  };

  const handleAddTimeBlock = async (newTimeBlock: TimeBlock) => {
    try {
      const updatedSchedule = await addTimeBlock(newTimeBlock);
      setSchedule(updatedSchedule);
    } catch (error) {
      setError('Failed to add time block.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Today's Schedule</h1>
        <AddTimeBlockForm onAdd={handleAddTimeBlock} />
      </div>

      <div className="grid grid-cols-12 gap-0 w-full" style={{ height: 'calc(100vh - 10rem)', position: 'relative' }}>
        <div className="col-span-1">
          {timeSlots.filter(slot => slot.label).map((slot, index) => (
            <div key={index} className="flex justify-end pr-2 text-[10px] text-gray-600" style={{ height: '4.1667%' /* Adjusted height */ }}>
              <p className="relative" style={{ top: '-15%' }}>
                {format(slot.time, 'ha')}
              </p>
            </div>
          ))}
        </div>
        <div className="col-span-6 relative schedule-grid">
          {timeSlots.map((slot, index) => (
            <div key={index} className="relative border-t" style={{ height: '2.08335%' /* Adjusted height */ }}>
              <div className="absolute left-0 top-0 bottom-0 border-t border-gray-300 w-full"></div>
            </div>
          ))}

          {/* Red line indicating current time */}
          <div ref={currentTimeRef} className="absolute w-full border-t-2 border-red-500" style={{ top: `${getCurrentTimePosition()}%` }}></div>

          {schedule.timeBlocks.map((block, index) => (
            <div
              key={block._id}
              className="absolute rounded-lg shadow-md"
              style={{
                top: `${getBlockPosition(new Date(block.startTime))}%`,
                height: `${getBlockHeight(new Date(block.startTime), new Date(block.endTime))}%`,
                width: '100%',
                backgroundColor: getColorByCategory(block.category), // Set background color based on category
              }}
            >
              <TimeBlock block={block} />
            </div>
          ))}
        </div>
        <div className="col-span-5 relative task-grid items-center flex justify-center items-center">
            <WeeklyHoursSummary weeklyHours={weeklyHours} userData={userData} />
        </div>
      </div>
    </div>
  );
}