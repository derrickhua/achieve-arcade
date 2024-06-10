import React from 'react';
import { format, setHours, setMinutes } from 'date-fns';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

interface TimeBlock {
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
    const hourSlot = { time: setHours(setMinutes(new Date(), 0), i), label: true };
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

const ScheduleSection: React.FC<{ timeBlocks: TimeBlock[] }> = ({ timeBlocks }) => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="grid grid-cols-[4rem_1fr] grid-rows-24 h-full w-[40%]">
      <div className="col-span-1">
        {timeSlots.map((slot, index) => (
          <div
            key={index}
            className={`flex justify-end text-[20px] ${index !== timeSlots.length - 1 ? 'border-b' : ''} border-black border-dashed`}
            style={{ height: '4.1667%' /* Adjusted height */ }}
          >
            <p className="flex h-full w-full items-center justify-center  border-r border-black border-dashed">
              {format(slot.time, 'ha')}
            </p>
          </div>
        ))}
      </div>
      <div className="col-span-1 relative schedule-grid">
        {timeSlots.map((slot, index) => (
          <div
            key={index}
            className={`relative border-dashed border-black ${index !== timeSlots.length - 1 ? 'border-b' : ''}`}
            style={{ height: '4.1667%' /* Adjusted height */ }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-full border-dashed"></div>
          </div>
        ))}

        {timeBlocks.map(block => (
          <div
            key={block._id}
            className="absolute rounded-lg shadow-md"
            style={{
              top: `${getBlockPosition(new Date(block.startTime))}%`,
              height: `${getBlockHeight(new Date(block.startTime), new Date(block.endTime))}%`,
              width: '100%',
              backgroundColor: getColorByCategory(block.category),
            }}
          >
            <div className="p-2">
              <strong>{block.name}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
