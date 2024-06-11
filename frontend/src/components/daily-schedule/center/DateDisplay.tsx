import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

interface DateDisplayProps {
  date: string;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const formattedDate = format(new Date(date), 'MMMM dd yyyy'); // Format date as Month day year
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDayIndex = new Date(date).getDay();

  return (
    <div className="mb-4 flex h-[175px] p-4 bg-[#efbf7b] border-[2px] border-dashed border-black rounded-3xl">
      <div className="flex justify-center items-center h-full mr-[35px]">
        <Image src="/icons/daily-schedule/calendarbook.png" alt="Calendar" width={139} height={119} />
      </div>
      <div>
        <p className="text-[25px]">DATE</p>
        <h2 className="text-[30px] mb-2">{formattedDate}</h2>
        <div className="flex justify-center space-x-2 mt-2 text-[30px]">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                index === currentDayIndex ? 'bg-[#A4C464] text-[#FEFDF2] border border-[#FEFDF2]' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateDisplay;
