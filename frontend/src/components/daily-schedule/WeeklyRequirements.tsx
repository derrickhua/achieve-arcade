import React from 'react';

const WeeklyHourRequirementsSection: React.FC = () => {
  return (
    <div className="flex flex-col w-[20%] h-full">
      <div className="bg-[#F0F0F0] p-4 rounded-lg shadow-lg h-full">
        <div className="text-[30px] mb-4">WEEKLY HOUR REQUIREMENTS</div>
        {[
          { label: 'WORK', current: 4, target: 16, color: 'red' },
          { label: 'LEISURE', current: 2, target: 8, color: 'blue' },
          { label: 'ATELIC', current: 1, target: 4, color: 'green' },
          { label: 'FRIENDS & FAMILY', current: 8, target: 10, color: 'orange' }
        ].map(({ label, current, target, color }) => (
          <div key={label} className={`flex items-center justify-between bg-${color}-200 p-2 m-2 rounded-md`}>
            <span className="text-[20px]">{label}</span>
            <span className="text-[20px]">{current}/{target}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyHourRequirementsSection;
