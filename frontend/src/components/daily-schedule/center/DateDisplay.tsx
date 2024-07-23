import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useMediaQuery } from 'react-responsive';

const DateDisplay: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Get the user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get the current date and time in the user's timezone
  const currentDate = new Date().toLocaleString("en-US", { timeZone: userTimezone });
  const formattedDate = format(new Date(currentDate), 'MMMM dd, yyyy'); // Format date as Month day, year

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDayIndex = new Date(currentDate).getDay(); // Get day in local time

  return (
    <div className="mb-2 md:mb-4 flex md:flex-row md:items-center md:p-4 md:h-[175px] md:bg-[#efbf7b] md:border-[2px] border-dashed border-black rounded-3xl justify-around md:justify-start">
      <div className="flex justify-center items-center h-full mb-2 md:mb-0 mr-4 md:mr-[35px]">
        <Image
          src="/icons/daily-schedule/calendarbook.png"
          alt="Calendar"
          width={isMobile ? 50 : 139}
          height={isMobile ? 50 : 119}
          className="md:w-[139px] md:h-[119px]"
          onContextMenu={(e) => e.preventDefault()}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div>
        <p className="text-[15px] md:text-[25px]">DATE</p>
        <h2 className="text-[15px] md:text-[30px] mb-2">{formattedDate}</h2>
        <div className={`flex space-x-1 md:space-x-2 text-[15px] md:text-[30px] ${isMobile ? 'items-center' : 'md:mt-2'}`}>
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className={`w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded ${
                index === currentDayIndex ? 'bg-[#A4C464] text-[#FEFDF2]' : ''
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
