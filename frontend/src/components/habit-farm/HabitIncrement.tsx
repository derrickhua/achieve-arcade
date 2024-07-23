import React, { useState, useEffect } from 'react';
import { CircleArrowUp, CircleArrowDown } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

const HabitIncrement = ({ initialCount, habitId, onUpdateCompletion }) => {
  const [count, setCount] = useState(initialCount);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    setCount(initialCount); // Sync the count with initialCount whenever it changes
    console.log('Initial count set to:', initialCount);
  }, [initialCount]);

  const incrementCount = async () => {
    const newCount = count + 1;
    console.log('Incrementing count to:', newCount); // Add this log
    try {
      await onUpdateCompletion(habitId, newCount);
      setCount(newCount); // Update the count state
      console.log('Increment successful, new count:', newCount);
    } catch (error) {
      console.error('Error updating habit completion:', error);
    }
  };

  const decrementCount = async () => {
    if (count > 0) {
      const newCount = count - 1;
      console.log('Decrementing count to:', newCount); // Add this log
      try {
        await onUpdateCompletion(habitId, newCount);
        setCount(newCount); // Update the count state
        console.log('Decrement successful, new count:', newCount);
      } catch (error) {
        console.error('Error updating habit completion:', error);
      }
    }
  };

  return (
    <div className="habit-increment-area flex flex-col items-center justify-center md:space-y-2">
      <p className="text-[13px] md:text-[16px] garamond flex text-center"># of times done today</p>
      <div className="flex">
        <span className="text-[50px] md:text-[60px] mr-2">{count}</span>
        <div className="flex flex-col justify-center items-center">
          <button 
            className="md:mb-2 md:hover:bg-[#C0D470] hover:rounded-[20px]"
            onClick={incrementCount}
            aria-label="Increment count"
          >
            <CircleArrowUp color="#C0D470" size={isMobile ? 30 : 35} />
          </button>
          <button 
            className="md:hover:bg-[#EB5757] hover:rounded-[20px]"
            onClick={decrementCount}
            aria-label="Decrement count"
            disabled={count === 0}
          >
            <CircleArrowDown color="#EB5757" size={isMobile ? 30 : 35} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitIncrement;
