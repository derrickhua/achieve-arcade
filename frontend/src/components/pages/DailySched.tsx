import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';


const DailySched: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex items-center">
          <span className='text-[50px] mr-4'>DailySched</span>
        </div>
        <AddButton name="ADD HABIT"  />
      </div>
      <div className="flex flex-wrap justify-between max-w-[1800px] w-full">

      </div>
    </div>
  );
};

export default DailySched;
