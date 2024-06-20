import React from 'react';
import Image from 'next/image';

interface NavItemProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  height?: number;
  width?: number;
  marginLeft?: number;
  marginBottom?: number;
}

const NavItem: React.FC<NavItemProps> = ({ iconSrc, label, onClick, active, height = 20, width = 20, marginLeft = 0, marginBottom = 20 }) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-[75px] h-[75px] flex flex-col items-center justify-between p-1 rounded-xl cursor-pointer border-3 ${
        active ? 'bg-[#FEFDF2] text-black' : 'bg-black border-[3px] border-[#FEFDF2] text-[#FEFDF2]'
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center" style={{ marginLeft, marginBottom }}>
        <Image src={iconSrc} alt={`${label} icon`} width={width} height={height} quality={100} style={{ imageRendering: 'pixelated' }} />
      </div>
      <p className="absolute bottom-1 text-center flex justify-center items-center leading-[13px] text-[15px] h-[26px]">{label}</p>
    </div>
  );
};

export default NavItem;
