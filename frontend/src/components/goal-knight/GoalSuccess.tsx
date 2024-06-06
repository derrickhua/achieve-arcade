import React from 'react';
import Image from 'next/image';

interface GoalSuccessProps {
  goalName: string;
  completionDate: string;
}

const GoalSuccess: React.FC<GoalSuccessProps> = ({ goalName, completionDate }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      <div className="relative mb-2 flex items-center justify-center">
        <Image
          src="/icons/goal-knight/knight-fire.gif"
          alt="Knight Fire"
          width={100}
          height={100}
          className="absolute left-[-110px]"
        />
        <p className="text-[90px] text-[#6FCF97] leading-none">SUCCESS!</p>
        <Image
          src="/icons/goal-knight/knight-fire.gif"
          alt="Knight Fire"
          width={100}
          height={100}
          className="absolute right-[-110px]"
        />
      </div>
      <p className="text-[30px] leading-snug">You completed your goal of</p>
      <p className="text-[30px] text-[#6FCF97]">{goalName}</p>
      <p className="text-[20px]">on</p>
      <p className="text-[40px]">{completionDate}</p>
      <div className="absolute bottom-[130px] left-5 flex flex-col items-center z-10">
        <Image
          src="/icons/goal-knight/knight-success.gif"
          alt="Knight Success"
          width={120}
          height={100}
        />
      </div>
      <div className="absolute bottom-4 left-6 flex flex-col items-center z-0">
        <Image
          src="/icons/goal-knight/castle.png"
          alt="Castle"
          width={120}
          height={100}
        />
      </div>
      <div className="absolute bottom-4 right-[0px] flex flex-col items-center space-y-2">
        <Image
          src="/icons/goal-knight/arrow-stand.gif"
          alt="Arrow Stand"
          width={100}
          height={50}
        />
      </div>
      <div className="absolute bottom-4 right-[120px] flex flex-col items-center space-y-2">
        <p className="absolute bottom-[60px] text-[20px] font-bold text-black z-20">YIPPEE!</p>
        <Image
          src="/icons/goal-knight/pawn-stand.gif"
          alt="Pawn Stand"
          width={100}
          height={50}
        />
      </div>
      <div className="absolute bottom-[35px] right-[50px] flex flex-col items-center space-y-2">
        <p className="absolute bottom-[60px] text-[20px] font-bold text-black z-20">HOORAY!</p>
        <Image
          src="/icons/goal-knight/pawn-standleft.gif"
          alt="Pawn Stand Left"
          width={100}
          height={50}
        />
      </div>
      <div className="absolute bottom-[120px] right-4 flex flex-row space-x-2 z-10">
      <Image
          src="/icons/goal-knight/house.png"
          alt="House"
          width={62}
          height={94}
        />
        <Image
          src="/icons/goal-knight/house.png"
          alt="House"
          width={62}
          height={94}
        />
        <Image
          src="/icons/goal-knight/house.png"
          alt="House"
          width={62}
          height={94}
        />
      </div>
    </div>
  );
};

export default GoalSuccess;
