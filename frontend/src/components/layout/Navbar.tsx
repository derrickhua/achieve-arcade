import React, { useState } from 'react';
import NavItem from './NavItem';

interface NavbarProps {
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveComponent }) => {
  const [activeComponent, setActiveComponentState] = useState('PlayerData');

  const handleNavItemClick = (component: string) => {
    setActiveComponent(component);
    setActiveComponentState(component);
  };

  return (
    <nav className="w-[100px] bg-black text-[#FEFDF2] flex flex-col p-2 items-center h-full">
      <ul className="space-y-[15px] mt-[50px]">
        <li>
          <NavItem
            iconSrc="/icons/heart.png" // Update with the correct path
            label="PLAYER DATA"
            onClick={() => handleNavItemClick('PlayerData')}
            active={activeComponent === 'PlayerData'}
            width={27}
            height={25}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/landing/images/warrior.png" // Update with the correct path
            label="GOAL KNIGHT"
            onClick={() => handleNavItemClick('GoalKnight')}
            active={activeComponent === 'GoalKnight'}
            width={50}
            height={50}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/landing/images/sunflower.png" // Update with the correct path
            label="HABIT FARM"
            onClick={() => handleNavItemClick('HabitFarm')}
            active={activeComponent === 'HabitFarm'}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/landing/images/knight.png" // Update with the correct path
            label="TASK SLAYER"
            onClick={() => handleNavItemClick('TaskSlayer')}
            active={activeComponent === 'TaskSlayer'}
            marginBottom={30}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/landing/images/calendar.png" // Update with the correct path
            label="DAILY SCHED"
            onClick={() => handleNavItemClick('DailySchedule')}
            active={activeComponent === 'DailySchedule'}
            
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/landing/images/gold-chest.png" // Update with the correct path
            label="SHOP"
            onClick={() => handleNavItemClick('Shop')}
            active={activeComponent === 'Shop'}
            width={45}
            height={45}
            marginLeft={12}
            marginBottom={20}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
