import React from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import TimeBlock from './timeblock/TimeBlock'; // Import the TimeBlock component

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

interface TimeBlockType {
  _id: string;
  name: string;
  category: 'work' | 'leisure' | 'family_friends' | 'atelic';
  startTime: Date;
  endTime: Date;
  tasks: Task[];
  completed: boolean;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hourSlot = { time: setHours(setMinutes(new Date(), 0), i), label: true, key: `hour-${i}` };
    slots.push(hourSlot);
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

const ScheduleSection: React.FC<{ timeBlocks: TimeBlockType[], onEdit: (timeBlock: TimeBlockType) => void, onDelete: (timeBlock: TimeBlockType) => void, fetchSchedule: () => void }> = ({ timeBlocks, onEdit, onDelete, fetchSchedule }) => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr] grid-rows-24 min-h-[559px] md:h-[80vh] w-full md:w-[40%]">
      <div className="col-span-1">
        {timeSlots.map((slot, index) => (
          <div
            key={slot.key}
            className={`flex justify-end text-[12px] md:text-[20px] ${index !== timeSlots.length - 1 ? 'border-b' : ''} border-black border-dashed`}
            style={{ height: '4.1667%' /* Adjusted height */ }}
          >
            <p className="flex h-full w-full items-center justify-center border-r border-black border-dashed">
              {format(slot.time, 'ha')}
            </p>
          </div>
        ))}
      </div>
      <div className="col-span-1 relative schedule-grid">
        {timeSlots.map((slot, index) => (
          <div
            key={slot.key}
            className={`relative border-dashed border-black ${index !== timeSlots.length - 1 ? 'border-b' : ''}`}
            style={{ height: '4.1667%' /* Adjusted height */ }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-full border-dashed"></div>
          </div>
        ))}
        {timeBlocks.map(block => (
          <div
            key={block._id}
            className="absolute rounded-lg shadow-md bg-blue-500" // Adjust the background color as needed
            style={{
              top: `${getBlockPosition(new Date(block.startTime))}%`,
              height: `${getBlockHeight(new Date(block.startTime), new Date(block.endTime))}%`,
              width: '95%', // Adjust width for mobile
              left: '2.5%' // Center the block within the container
            }}
          >
            <TimeBlock
              block={block}
              onEdit={onEdit}
              onDelete={onDelete}
              fetchSchedule={fetchSchedule}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
