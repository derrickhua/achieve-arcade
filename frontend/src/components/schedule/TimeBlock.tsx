import React from 'react';

const categoryColors = {
  work: 'bg-blue-500',
  leisure: 'bg-red-500',
  family_friends: 'bg-green-500',
  atelic: 'bg-yellow-500',
};

const TimeBlock = ({ block }) => {
  const colorClass = categoryColors[block.category] || 'bg-gray-500';

  return (
    <div className={`time-block flex flex-col justify-between h-full p-2 rounded-lg relative ${colorClass} text-white`}>
      <div className="flex justify-between items-center">
        <span className="block-name font-bold">{block.name}</span>
        <div className="flex space-x-1">
          {/* Settings Button */}
          <button className="settings-button text-white">
            <i className="fas fa-cog"></i>
          </button>
          {/* Close Button */}
          <button className="close-button text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div className="block-tasks flex justify-center items-center">
        {Array(block.tasks.length).fill(0).map((_, index) => (
          <div key={index} className="task-indicator w-3 h-3 rounded-full bg-white mx-1"></div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        {/* Expand Button */}
        <button className="expand-button text-white">
          <i className="fas fa-expand"></i>
        </button>
      </div>
    </div>
  );
};

export default TimeBlock;
