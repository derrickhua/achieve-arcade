import React from 'react';

const HabitFarmVisual: React.FC<{ habits: any[] }> = ({ habits }) => {
  if (habits.length === 0) return <div>No habits to visualize.</div>;

  return (
    <div className="flex flex-wrap">
      {habits.map((habit, index) => (
        <div key={habit._id} className="m-2 p-2 border border-black rounded-lg">
          <div className="text-[20px]">{habit.name}</div>
          <div className="text-[15px]">Streak: {habit.streak}</div>
        </div>
      ))}
    </div>
  );
};

export default HabitFarmVisual;
