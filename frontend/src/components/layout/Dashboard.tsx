'use client'
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { getUserCoins } from '@/lib/user';
import PlayerData from '../pages/PlayerData';
import GoalKnight from '../pages/GoalKnight';
import HabitFarm from '../pages/HabitFarm';
import TaskSlayer from '../pages/TaskSlayer';
import DailySched from '../pages/DailySched';
import Shop from '../pages/Shop';

export const DashboardLayout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('PlayerData');
  const [coins, setCoins] = useState(0);
  const fetchCoins = async () => {
    try {
      const coins = await getUserCoins();
      setCoins(coins);
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };
  // Fetch user coins on component mount
  useEffect(() => {
    fetchCoins();
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'PlayerData':
        return <PlayerData />;
      case 'GoalKnight':
        return <GoalKnight fetchCoins={fetchCoins} />;
      case 'HabitFarm':
        return <HabitFarm fetchCoins={fetchCoins} />;
      case 'TaskSlayer':
        return <TaskSlayer fetchCoins={fetchCoins} />;
      case 'DailySchedule':
        return <DailySched fetchCoins={fetchCoins} />;
      case 'Shop':
        return <Shop fetchCoins={fetchCoins} />;
      default:
        return <PlayerData />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <Topbar coins={coins} />
      <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
        <Navbar setActiveComponent={setActiveComponent} />
        <main className="overflow-y-auto flex-1 p-4 bg-[#FEFDF2] rounded-[2rem] pb-[66px] md:pb-0 md:rounded-tl-[3rem] md:rounded-tr-none md:rounded-bl-none md:rounded-br-none">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};
