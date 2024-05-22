import React from 'react';

interface WeeklyHoursProps {
  weeklyHours: {
    work: number;
    leisure: number;
    family_friends: number;
    atelic: number;
  };
  userData: {
    workHoursPerWeek: number;
    leisureHoursPerWeek: number;
    familyFriendsHoursPerWeek: number;
    atelicHoursPerWeek: number;
  };
}

const WeeklyHoursSummary: React.FC<WeeklyHoursProps> = ({ weeklyHours, userData }) => {
  // Ensure that weeklyHours and userData are not null or undefined
  const { work = 0, leisure = 0, family_friends = 0, atelic = 0 } = weeklyHours || {};
  const {
    workHoursPerWeek = 0,
    leisureHoursPerWeek = 0,
    familyFriendsHoursPerWeek = 0,
    atelicHoursPerWeek = 0,
  } = userData || {};

  return (
    <div className="weekly-hours-summary grid grid-cols-2 gap-4">
      <div className="summary-box w-[180px] h-[180px] flex flex-col justify-between items-center bg-[#3B82F6] rounded-xl">
        <div className="box-content flex-grow flex items-center justify-center">
          <span className="text-[48px] text-white">{work}</span>
          <span className="text-[48px] text-white">/</span>
          <span className="text-[48px] text-white">{workHoursPerWeek}</span>
        </div>
        <div className="box-header mb-2 text-white text-[32px]">WORK</div>
      </div>
      <div className="summary-box w-[180px] h-[180px] flex flex-col justify-between items-center bg-[#EF4444] rounded-xl">
        <div className="box-content flex-grow flex items-center justify-center">
          <span className="text-[48px] text-white">{leisure}</span>
          <span className="text-[48px] text-white">/</span>
          <span className="text-[48px] text-white">{leisureHoursPerWeek}</span>
        </div>
        <div className="box-header mb-2 text-white text-[32px]">LEISURE</div>
      </div>
      <div className="summary-box w-[180px] h-[180px] flex flex-col justify-between items-center bg-[#22C55E] rounded-xl">
        <div className="box-content flex-grow flex items-center justify-center">
          <span className="text-[48px] text-white">{family_friends}</span>
          <span className="text-[48px] text-white">/</span>
          <span className="text-[48px] text-white">{familyFriendsHoursPerWeek}</span>
        </div>
        <div className="box-header mb-2 text-white text-[19px] text-center">FAMILY & <br /> FRIENDS</div>
      </div>
      <div className="summary-box w-[180px] h-[180px] flex flex-col justify-between items-center bg-[#F59E0B] rounded-xl">
        <div className="box-content flex-grow flex items-center justify-center">
          <span className="text-[48px] text-white">{atelic}</span>
          <span className="text-[48px] text-white">/</span>
          <span className="text-[48px] text-white">{atelicHoursPerWeek}</span>
        </div>
        <div className="box-header mb-2 text-white text-[32px]">ATELIC</div>
      </div>
    </div>
  );
};

export default WeeklyHoursSummary;
