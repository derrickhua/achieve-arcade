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

const NavItem: React.FC<NavItemProps> = ({
  iconSrc,
  label,
  onClick,
  active,
  height = 20,
  width = 20,
  marginLeft = 0,
  marginBottom = 20,
}) => {

  return (
    <div
      onClick={onClick}
      className={`relative md:w-[75px] md:h-[75px] w-[10vw] h-[10vw] flex items-center justify-center p-1 rounded-lg cursor-pointer ${
        active ? 'bg-[#FEFDF2] text-black border-3' : 'bg-black text-[#FEFDF2] md:border-[3px] md:border-[#FEFDF2] border-black'
      }`}
    >
      <div
        className={`flex items-center justify-center w-full h-full md:mb-[20px] `}
        style={{
          marginLeft,
        }}
      >
        <Image
          src={iconSrc}
          alt={`${label} icon`}
          width={width}
          height={height}
          quality={100}
          style={{ imageRendering: 'pixelated' }}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <p className="hidden md:block absolute bottom-1 text-center leading-[13px] text-[15px] h-[26px]">{label}</p>
    </div>
  );
};

export default NavItem;
