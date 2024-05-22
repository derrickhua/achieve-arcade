import React from 'react';

export default function TimeBlock({ block }) {
  return (
    <div className="relative flex">
      <div className="flex">
        <p>{block.name}</p>
      </div>
    </div>
  );
}
