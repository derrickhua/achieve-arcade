'use client';
import React, { useState } from 'react';
import { X, Minus, Plus, Maximize2 } from 'lucide-react';
import { updateHabitCompletion } from '@/lib/habit';
import './habits.css';

interface Habit {
  _id: string;
  name: string;
  habitTotal: number;
  habitPeriod: string;
  latestGoal: {
    goal: number;
    effectiveDate: string;
  };
}

const HabitCard: React.FC<{ habit: Habit; deleteHabit: (id: string) => void; maximizeHabit: (habit: Habit) => void; }> = ({ habit, deleteHabit, maximizeHabit }) => {
  const [count, setCount] = useState(habit.habitTotal);
  const formattedDate = new Date().toISOString();

  const incrementCount = async () => {
    try {
      const completionChange = 1;
      const newCount = count + completionChange;
      setCount(newCount);
      await updateHabitCompletion(habit._id, completionChange, formattedDate);
    } catch (error) {
      console.error('Error incrementing habit:', error);
    }
  };

  const decrementCount = async () => {
    if (count > 0) {
      try {
        const completionChange = -1;
        const newCount = count + completionChange;
        setCount(newCount);
        await updateHabitCompletion(habit._id, completionChange, formattedDate);
      } catch (error) {
        console.error('Error decrementing habit:', error);
      }
    }
  };

  return (
    <div className="habit-card shadow-lg rounded-lg border p-4 relative max-w-[500px] max-h-[500px]">
      <button className="absolute right-2 top-2 text-red-500" onClick={() => deleteHabit(habit._id)}>
        <X />
      </button>
      <button className="absolute left-2 top-2 text-gray-500" onClick={() => maximizeHabit(habit)}>
        <Maximize2 />
      </button>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-[60px] text-center flex-1 flex items-center mt-5">{count}</div>
        <div className="flex items-center mt-4">
          <button className="text-green-500 mr-2" onClick={decrementCount} disabled={count === 0}>
            <Minus />
          </button>
          <div className="text-lg text-center">{habit.name}</div>
          <button className="text-green-500 ml-2" onClick={incrementCount}>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
