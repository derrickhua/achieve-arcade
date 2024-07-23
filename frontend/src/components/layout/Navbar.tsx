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
    <nav className="bg-black text-[#FEFDF2] flex lg:flex-col fixed bottom-0 lg:relative w-full lg:w-[100px] p-2 items-center lg:h-full justify-around lg:justify-start z-20 overflow-x-hidden">
      <ul className="flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-[15px] mt-0 lg:mt-[50px]">
        <li>
          <NavItem
            iconSrc="/icons/nav/heart.png"
            label="PLAYER DATA"
            onClick={() => handleNavItemClick('PlayerData')}
            active={activeComponent === 'PlayerData'}
            width={27}
            height={25}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/nav/warrior.png"
            label="GOAL KNIGHT"
            onClick={() => handleNavItemClick('GoalKnight')}
            active={activeComponent === 'GoalKnight'}
            width={35}
            height={35}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/nav/flowers.png"
            label="HABIT FARM"
            onClick={() => handleNavItemClick('HabitFarm')}
            active={activeComponent === 'HabitFarm'}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/nav/knight.png"
            label="TASK SLAYER"
            onClick={() => handleNavItemClick('TaskSlayer')}
            active={activeComponent === 'TaskSlayer'}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/nav/calendar.png"
            label="DAILY SCHED"
            onClick={() => handleNavItemClick('DailySchedule')}
            active={activeComponent === 'DailySchedule'}
          />
        </li>
        <li>
          <NavItem
            iconSrc="/icons/nav/gold-chest.png"
            label="SHOP"
            onClick={() => handleNavItemClick('Shop')}
            active={activeComponent === 'Shop'}
            width={35}
            height={35}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
