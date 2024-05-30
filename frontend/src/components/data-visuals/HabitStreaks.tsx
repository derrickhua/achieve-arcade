import React from 'react';

interface HabitStreaksProps {
  streaks: number | string; // Progress percentage (0-100)
}

const HabitStreaks: React.FC<HabitStreaksProps> = ({ streaks }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full aspect-square bg-green-300 rounded-lg p-4 shadow-lg">
      <div className="text-white text-[100px] flex-grow flex items-center justify-center">
        {streaks}
      </div>
      <div className="text-white text-[20px]">
        Active Habits
      </div>
    </div>
  );
};

export default HabitStreaks;
