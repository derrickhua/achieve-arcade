import React from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

interface GoalSuccessProps {
  goalName: string;
  completionDate: string;
}

const GoalSuccess: React.FC<GoalSuccessProps> = ({ goalName, completionDate }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-4 md:p-0">
      <div className="relative mb-2 flex items-center justify-center">
        <Image
          src="/icons/goal-knight/knight-fire.gif"
          alt="Knight Fire"
          width={isMobile ? 50 : 100}
          height={isMobile ? 50 : 100}
          className="absolute left-[-60px] md:left-[-110px]"
          onContextMenu={(e) => e.preventDefault()}
        />
        <p className="text-[40px] md:text-[90px] text-[#6FCF97] leading-none">SUCCESS!</p>
        <Image
          src="/icons/goal-knight/knight-fire.gif"
          alt="Knight Fire"
          width={isMobile ? 50 : 100}
          height={isMobile ? 50 : 100}
          className="absolute right-[-60px] md:right-[-110px]"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <p className="text-[18px] md:text-[30px] leading-snug text-center">You completed your goal of</p>
      <p className="text-[18px] md:text-[30px] text-[#6FCF97] text-center">{goalName}</p>
      <p className="text-[16px] md:text-[20px] text-center">on</p>
      <p className="text-[22px] md:text-[40px] text-center">{completionDate}</p>
      <div className="absolute bottom-[10px] md:bottom-[130px] left-0 md:left-5 flex flex-col items-center z-10">
        <Image
          src="/icons/goal-knight/knight-success.gif"
          alt="Knight Success"
          width={isMobile ? 60 : 120}
          height={isMobile ? 60 : 100}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      {!isMobile && 
      <div className="absolute bottom-4 left-6 flex flex-col items-center z-0">
        <Image
          src="/icons/goal-knight/castle.png"
          alt="Castle"
          width={120}
          height={100}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      } 
      {!isMobile && 
      <div className="absolute bottom-4 right-[0px] flex flex-col items-center space-y-2">
        <Image
          src="/icons/goal-knight/arrow-stand.gif"
          alt="Arrow Stand"
          width={100}
          height={50}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div> 
      }
        <div className="absolute bottom-1 md:bottom-[-15px] right-0 md:right-[120px] flex flex-col items-center space-y-2">
          <p className="absolute bottom-[40px] md:text-[20px] font-bold text-black z-20 text-center top-2">YIPPEE!</p>
          <Image
            src="/icons/goal-knight/pawn-stand.gif"
            alt="Pawn Stand"
            width={isMobile ? 60 : 100}
            height={isMobile ? 60 : 50}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      {
        !isMobile && 
        <div className="absolute bottom-1 right-[-15px] md:bottom-[35px] md:right-[50px] flex flex-col items-center space-y-2">
          <p className="absolute bottom-[40px] md:text-[20px] font-bold text-black z-20 top-2 text-center">HOORAY!</p>
          <Image
            src="/icons/goal-knight/pawn-standleft.gif"
            alt="Pawn Stand Left"
            width={isMobile ? 60 : 100}
            height={isMobile ? 60 : 50}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      }
      {!isMobile && 
      <div className="absolute bottom-[120px] right-4 flex flex-row space-x-2 z-10">
        <Image
          src="/icons/goal-knight/house.png"
          alt="House"
          width={62}
          height={94}
          onContextMenu={(e) => e.preventDefault()}
        />
        <Image
          src="/icons/goal-knight/house.png"
          alt="House"
          width={62}
          height={94}
          onContextMenu={(e) => e.preventDefault()}
        />
        <Image
          src="/icons/goal-knight/house.png"
          alt="House"
          width={62}
          height={94}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      }
    </div>
  );
};

export default GoalSuccess;
