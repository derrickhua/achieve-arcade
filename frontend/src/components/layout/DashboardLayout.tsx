'use client';
import React, { useState } from 'react';
import Navbar from './Navbar';
import PlayerData from '../PlayerData';
import GoalKnight from '../GoalKnight';
import HabitFarm from '../HabitFarm';
import TaskSlayer from '../TaskSlayer';
import DailySchedule from '../DailySchedule';
import Shop from '../Shop';

export const DashboardLayout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('PlayerData');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'PlayerData':
        return <PlayerData />;
      case 'GoalKnight':
        return <GoalKnight />;
      case 'HabitFarm':
        return <HabitFarm />;
      case 'TaskSlayer':
        return <TaskSlayer />;
      case 'DailySchedule':
        return <DailySchedule />;
      case 'Shop':
        return <Shop />;
      default:
        return <PlayerData />;
    }
  };

  return (
    <div className="flex">
      <Navbar setActiveComponent={setActiveComponent} />
      <main className="flex-1 p-4">
        {renderComponent()}
      </main>
    </div>
  );
};
