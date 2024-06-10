import React, { useState } from 'react';
import Image from 'next/image';

const TaskSquare: React.FC<{ task: any; onDelete: (task: any) => void; onComplete: (task: any) => void }> = ({ task, onDelete, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const monsterSrc = `/icons/task-slayer/${task.monster}.gif`;
  const explosionSrc = `/icons/task-slayer/explosion.gif`;

  const handleCompleteClick = () => {
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setIsCompleted(true);
      onComplete(task);
    }, 1000);
  };

  return (
    <div
      className="task-square bg-[#4F4F4F] border-black border-[10px] p-4 m-2 rounded-3xl w-[20vw] h-[20vw] max-w-[330px] max-h-[330px] flex flex-col justify-between items-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isCompleted && handleCompleteClick()}
    >
      <div className={`absolute top-2 right-4 text-[30px] text-[#EB5757] ${isHovered ? 'block' : 'hidden'} z-10 cursor-pointer delete-button`}>
        <button onClick={(e) => { e.stopPropagation(); onDelete(task); }}>X</button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {isExploding ? (
          <div className="w-full h-auto max-w-[150px] mb-2" style={{ imageRendering: 'pixelated' }}>
            <Image src={explosionSrc} alt="explosion" width={300} height={300} />
          </div>
        ) : (
          !isCompleted && (
            <div className="w-full h-auto max-w-[150px] mb-2" style={{ imageRendering: 'pixelated' }}>
              <Image src={monsterSrc} alt={task.monster} width={100} height={100} />
            </div>
          )
        )}
      </div>
      <div className="text-[30px] text-white mb-2 max-w-[200px] text-center break-words leading-none" style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', hyphens: 'auto', position: 'absolute', bottom: '10px' }}>
        {task.name.toUpperCase()}
      </div>
    </div>
  );
};

export default TaskSquare;
