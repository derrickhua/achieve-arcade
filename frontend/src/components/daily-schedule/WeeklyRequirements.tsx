import React from 'react';

interface WeeklyMetrics {
  work: number;
  leisure: number;
  family_friends: number;
  atelic: number;
}

interface Preferences {
  workHoursPerWeek: number;
  leisureHoursPerWeek: number;
  familyFriendsHoursPerWeek: number;
  atelicHoursPerWeek: number;
}

interface WeeklyHourRequirementsSectionProps {
  weeklyMetrics: {
    categoryHours: WeeklyMetrics;
    preferences: Preferences;
  };
}

const WeeklyHourRequirementsSection: React.FC<WeeklyHourRequirementsSectionProps> = ({ weeklyMetrics }) => {
  const { categoryHours, preferences } = weeklyMetrics;
  const categories = [
    { label: 'WORK', current: categoryHours.work, target: preferences.workHoursPerWeek, color: 'bg-[#b82c05]' },
    { label: 'LEISURE', current: categoryHours.leisure, target: preferences.leisureHoursPerWeek, color: 'bg-[#71906a]' },
    { label: 'ATELIC', current: categoryHours.atelic, target: preferences.atelicHoursPerWeek, color: 'bg-[#a3bdb6]' },
    { label: 'FRIENDS & FAMILY', current: categoryHours.family_friends, target: preferences.familyFriendsHoursPerWeek, color: 'bg-[#efbf7b]' },
  ];

  return (
    <div className="flex flex-col items-center p-4 w-[20%] h-full">
      <div className="text-[30px] text-center mb-4">WEEKLY HOUR REQUIREMENTS</div>
      <div className="flex flex-col space-y-4">
        {categories.map(({ label, current, target, color }) => (
          <div 
            key={label} 
            className={`flex flex-col items-center justify-center w-[15vw] h-[15vw] max-w-[180px] max-h-[180px] ${color} rounded-md shadow-md text-black p-4`}>
            <div className="text-[40px] h-full flex items-center">{current} / {target}</div>
            <div className="text-[20px] mt-auto text-center">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyHourRequirementsSection;
