import React from 'react';

interface SquareBlockProps {
  value: number;
  label: string;
  color: string; // Hex code for text and border color
}

const SquareBlock: React.FC<SquareBlockProps> = ({ value, label, color }) => {
  return (
    <div
      className="flex flex-col items-center justify-center border-[3px] rounded-xl w-[18vw] h-[18vw] md:w-[200px] md:h-[200px] relative"
      style={{
        borderColor: color,
        color: color,
      }}
    >
      <div className="flex-grow flex items-center justify-center ">
        <h4 className="text-[25px] sm:text-[30px] md:text-[100px]">{value && (value.toFixed(0))}</h4>
      </div>
      <p className="text-[9px] leading-none sm:text-[11px] md:text-[20px] absolute bottom-1 md:bottom-2 text-center leading-none">{label.toUpperCase()}</p>
    </div>
  );
};

export default SquareBlock;
