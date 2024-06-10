import React from 'react';

const CenterSection: React.FC = () => {
  return (
    <div className="flex flex-col w-[40%] h-full">
      <div className="bg-[#F0F0F0] p-4 rounded-lg shadow-lg h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[30px]">DATE</div>
          <div className="flex space-x-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <div key={day} className="text-[20px] p-2 bg-[#E0E0E0] rounded-md">{day}</div>
            ))}
          </div>
        </div>
        <div className="bg-[#FFF0E0] rounded-lg mb-4 p-4">
          <div className="text-[20px] mb-2">TODAY'S TASKS</div>
          <div className="flex flex-wrap">
            {['RESEARCH', 'WRITE 500 WORDS', 'WRITE 1000 WORDS', 'DANCE 1 HOUR'].map(task => (
              <div key={task} className="flex items-center bg-[#E0E0E0] p-2 m-1 rounded-md">
                <span className="text-[16px] mr-2">{task}</span>
                <input type="checkbox" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#FFF0E0] p-4 rounded-lg">
          <div className="text-[20px] mb-2">NOTES</div>
          <textarea className="w-full h-32 p-2 rounded-md border border-gray-400"></textarea>
        </div>
      </div>
    </div>
  );
};

export default CenterSection;
