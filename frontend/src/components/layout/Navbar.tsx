import React from 'react';

interface NavbarProps {
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveComponent }) => {
  return (
    <div>
      <nav className="w-[100px] bg-black text-white h-screen flex flex-col p-4">
        <div className="mb-4">
          <button onClick={() => setActiveComponent('PlayerData')} className="block w-full text-left">🏠 Player Data</button>
        </div>
        <ul className="space-y-4">
          <li>
            <button onClick={() => setActiveComponent('PlayerData')} className="block w-full text-left">🏆 Player Data</button>
          </li>
          <li>
            <button onClick={() => setActiveComponent('GoalKnight')} className="block w-full text-left">🎯 Goal Knight</button>
          </li>
          <li>
            <button onClick={() => setActiveComponent('HabitFarm')} className="block w-full text-left">🌱 Habit Farm</button>
          </li>
          <li>
            <button onClick={() => setActiveComponent('TaskSlayer')} className="block w-full text-left">🗡️ Task Slayer</button>
          </li>
          <li>
            <button onClick={() => setActiveComponent('DailySchedule')} className="block w-full text-left">📅 Daily Schedule</button>
          </li>
          <li>
            <button onClick={() => setActiveComponent('Shop')} className="block w-full text-left">🛒 Shop</button>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Navbar;
