import React, { useState, useEffect } from 'react';
import { CircleArrowUp, CircleArrowDown } from 'lucide-react';

interface HabitIncrementProps {
  initialCount: number;
  habitId: string; // To identify the habit that needs updating
  onUpdateCompletion: (newCount: number) => Promise<void>; // Function to handle completion updates
}

const HabitIncrement: React.FC<HabitIncrementProps> = ({ initialCount, habitId, onUpdateCompletion }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount); // Sync the count with initialCount whenever it changes
  }, [initialCount]);

  const incrementCount = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await onUpdateCompletion(newCount);
  };

  const decrementCount = async () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      await onUpdateCompletion(newCount);
    }
  };

  return (
    <div className="habit-increment-area flex flex-col items-center justify-center space-y-2">
      <p className="text-[16px] garamond flex text-center"># of times done today</p>
      <div className="flex">
        <span className="text-[60px] mr-2">{count}</span>
        <div className="flex flex-col justify-center items-center">
          <button 
            className="mb-2 hover:bg-[#C0D470] hover:rounded-[20px]"
            onClick={incrementCount}
            aria-label="Increment count"
          >
            <CircleArrowUp color="#C0D470" size={35} />
          </button>
          <button 
            className="hover:bg-[#EB5757] hover:rounded-[20px]"
            onClick={decrementCount}
            aria-label="Decrement count"
            disabled={count === 0}
          >
            <CircleArrowDown color="#EB5757" size={35} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitIncrement;
