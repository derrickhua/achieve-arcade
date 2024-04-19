import React, { useState } from 'react';
import { CircleArrowUp, CircleArrowDown } from 'lucide-react';
import { updateHabitCompletion } from '@/lib/habit';

interface HabitIncrementProps {
  initialCount: number;
  habitId: string; // To identify the habit that needs updating
}

const HabitIncrement: React.FC<HabitIncrementProps> = ({ initialCount, habitId }) => {
  const [count, setCount] = useState(initialCount);
  const formattedDate = new Date().toISOString();

  const incrementCount = async () => {
    const newCount = count + 1;
    setCount(newCount);
    // Call to update the completion on the server
    await updateHabitCompletion(habitId, newCount, formattedDate);
  };

  const decrementCount = async () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      // Ensure updates are sent to the server only when the count is decremented
      await updateHabitCompletion(habitId, newCount, formattedDate);
    }
  };
  console.log(formattedDate)
  return (
    <div className="habit-increment-area flex flex-col items-center justify-center space-y-2">
      <p className="text-[16px] garamond flex text-center "># of times done today</p>
      <div className="flex ">
        <span className="text-[60px]">{count}</span>
        <div className="flex flex-col justify-center items-center">
            <button 
            className="mb-2 hover:bg-[#98E4A5] hover:rounded-[20px]"
            onClick={incrementCount}
            aria-label="Increment count"
            >
            <CircleArrowUp color="#008000" size={25}/>
            </button>
            <button 
            className="hover:bg-[#E23B3B] hover:rounded-[20px]"
            onClick={decrementCount}
            aria-label="Decrement count"
            disabled={count === 0}
            >
            <CircleArrowDown color="#AF0707" size={25}/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default HabitIncrement;