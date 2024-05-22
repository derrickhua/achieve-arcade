import React from 'react';

export default function TimeBlock({ block }) {
  return (
    <div className="relative flex">
      <div className="flex-grow">
        <p>{block.name}</p>
        <p>{block.category}</p>
      </div>
      <div className="tasks-container flex flex-col">
        {block.tasks.map((task, index) => (
          <div key={index} className="task bg-green-500 text-white p-1 mb-1 rounded-lg">
            {task.name}
          </div>
        ))}
      </div>
    </div>
  );
}
