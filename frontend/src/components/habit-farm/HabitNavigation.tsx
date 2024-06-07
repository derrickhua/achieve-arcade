import React from 'react';
import { SunMedium } from 'lucide-react';

const HabitNavigation: React.FC<{ habits: any[], selectedHabitId: string, onSelectHabit: (habit: any) => void }> = ({ habits, selectedHabitId, onSelectHabit }) => {
  return (
    <div className="habit-navigation mt-[50px] grid grid-cols-6 grid-rows-2 gap-2 max-w-[1800px] mx-auto h-[200px] w-full px-2">
      {habits.map((habit) => (
        <button 
          key={habit._id} 
          className={`h-[5vw] w-[14vw] max-h-[50px] max-w-[280px] bg-[#E9D0A6] border-[4px] text-[30px] max-text-[20px] flex items-center justify-between px-6 rounded-xl ${
            habit._id === selectedHabitId 
              ? 'border-[#C0D470] text-[#67835C]'
              : 'border-[#AB7A5A] text-[#AB7A5A]'
          }`}
          onClick={() => onSelectHabit(habit)}
        >
          {habit.name} 
          <span className='text-[#F2994A] flex items-center gap-[4px]'>
            <p className='mt-1 text-[30px]'>{habit.streak}</p>
            <SunMedium size={25} strokeWidth={3}/>
          </span>
        </button>
      ))}
    </div>
  );
};

export default HabitNavigation;
