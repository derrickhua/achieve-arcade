import React from 'react';
import Image from 'next/image';

interface NavItemProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ iconSrc, label, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`w-[75px] h-[75px] flex flex-col items-center justify-between p-1 rounded-xl cursor-pointer border-3 ${
        active ? 'bg-[#FEFDF2] text-black' : 'bg-black border-[3px] border-[#FEFDF2] text-[#FEFDF2]'
      }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[20px] h-[20px]">
          <Image src={iconSrc} alt={`${label} icon`} layout="fill" objectFit="contain" quality={100} />
        </div>
      </div>
      <p className="text-center flex justify-center items-center leading-[13px] text-[15px] h-[26px]">{label}</p>
    </div>
  );
};

export default NavItem;
