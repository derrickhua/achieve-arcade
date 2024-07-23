import React from 'react';

const AddButton: React.FC<{ name: string, onClick: () => void }> = ({ name, onClick }) => {
  return (
    <button className="px-2 md:px-4 py-1 bg-[#FEFDF2] rounded-lg border-[3px] 
    border-black hover:text-[#FEFDF2] 
    hover:bg-black text-[15px] sm:text-[20px] md:text-[25px] leading-none" onClick={onClick}>
      {name}
    </button>
  );
};

export default AddButton;
