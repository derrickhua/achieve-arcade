import React from 'react';

const AddButton: React.FC<{ name: string, onClick: () => void }> = ({ name, onClick }) => {
  return (
    <button className="px-4 py-1 bg-[#FEFDF2] rounded-xl border-[3px] border-black hover:text-[#FEFDF2] hover:bg-black text-[25px]" onClick={onClick}>
      {name}
    </button>
  );
};

export default AddButton;
