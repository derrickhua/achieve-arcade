import React from 'react';

interface SquareBlockProps {
  value: number;
  label: string;
  color: string; // Hex code for text and border color
}

const SquareBlock: React.FC<SquareBlockProps> = ({ value, label, color }) => {
  return (
    <div
      className="flex flex-col items-center justify-center border-[3px] rounded-xl relative"
      style={{
        width: '200px',
        height: '200px',
        borderColor: color,
        color: color,
      }}
    >
      <div className="flex-grow flex items-center justify-center">
        <h4 className="text-[100px]">{value && (value.toFixed(0))}</h4>
      </div>
      <p className="text-[20px] absolute bottom-2 text-center">{label}</p>
    </div>
  );
};

export default SquareBlock;
