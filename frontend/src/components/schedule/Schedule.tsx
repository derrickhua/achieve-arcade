import React, { useState, useEffect, useRef } from 'react';
import { getDailySchedule, addTimeBlock, updateTimeBlock } from '@/lib/dailySchedule';
import TimeBlock from './TimeBlock';
import AddTimeBlockForm from './AddTimeBlockForm';
import { format, setHours, setMinutes, startOfToday } from 'date-fns';

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

export default function DailySchedule() {
  const [schedule, setSchedule] = useState<DailySchedule>({ timeBlocks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const timeSlots = generateTimeSlots();
  const currentTimeRef = useRef<HTMLDivElement>(null);

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

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const response: DailySchedule = await getDailySchedule();
      setSchedule(response || { timeBlocks: [] });
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch daily schedule.');
      setIsLoading(false);
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

      <div className="grid grid-cols-12 gap-4 w-full" style={{ height: 'calc(100vh - 10rem)', position: 'relative' }}>
        <div className="col-span-1">
          {timeSlots.filter(slot => slot.label).map((slot, index) => (
            <div key={index} className="flex justify-end pr-2 text-[10px] text-gray-600" style={{ height: '4.1667%' /* Adjusted height */ }}>
              <p className="relative" style={{ top: '-15%' }}>
                {format(slot.time, 'ha')}
              </p>
            </div>
          ))}
        </div>
        <div className="col-span-11 relative w-[50%]">
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
              className="absolute bg-blue-500 text-white rounded-lg shadow-md p-2"
              style={{
                left: '4rem',
                top: `${getBlockPosition(new Date(block.startTime))}%`,
                height: `${getBlockHeight(new Date(block.startTime), new Date(block.endTime))}%`,
                width: 'calc(100% - 4rem)',
              }}
            >
              <TimeBlock block={block} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
