import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';

const VisualKnight: React.FC<{ completedMilestones: number, milestoneJustCompleted: boolean, showKnightSlash: boolean, onAnimationComplete: () => void, onFinalAnimationComplete: () => void }> = ({ completedMilestones, milestoneJustCompleted, showKnightSlash, onAnimationComplete, onFinalAnimationComplete }) => {
  const positions = [
    { left: '5%', bottom: '0px' },
    { left: '45%', bottom: '0px' },
    { left: '80%', bottom: '0px' },
  ];

  const knightVSgoblinPositions = [
    { left: '0%', bottom: '0px' },
    { left: '38%', bottom: '0px' },
    { left: '70%', bottom: '0px' },
  ];

  const knightArrivalPositions = [
    '38%',
    '70%',
  ];

  const [knightImage, setKnightImage] = useState('/icons/goal-knight/knight-fight.png');
  const [knightDimensions, setKnightDimensions] = useState({ width: 180, height: 100 });
  const controls = useAnimation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showKnightSlash) {
      setKnightImage('/icons/goal-knight/knight-slash.gif');
      setKnightDimensions({ width: 180, height: 200 });
      const timer = setTimeout(() => {
        onFinalAnimationComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showKnightSlash, onFinalAnimationComplete]);

  useEffect(() => {
    let isMounted = true; // Add this line
  
    if (milestoneJustCompleted) {
      setKnightImage('/icons/goal-knight/knight-kill.gif');
      setKnightDimensions({ width: 180, height: 100 });
      const timer1 = setTimeout(() => {
        if (!isMounted) return; // Add this line
  
        setKnightImage('/icons/goal-knight/knight-walk.gif');
        setKnightDimensions({ width: 100, height: 100 });
        controls.start({
          left: knightArrivalPositions[completedMilestones],
          transition: { duration: 3 }
        });
        const timer2 = setTimeout(() => {
          if (!isMounted) return; // Add this line
  
          setKnightImage('/icons/goal-knight/knight-fight.png');
          const nextPosition = knightVSgoblinPositions[completedMilestones + 1] || { left: '100%', bottom: '0px' };
          controls.start({
            left: nextPosition.left,
            transition: { duration: 0 }
          });
          setKnightDimensions({ width: 180, height: 100 });
          onAnimationComplete();
        }, 3000);
        return () => clearTimeout(timer2);
      }, 1050);
      return () => {
        isMounted = false; // Add this line
        clearTimeout(timer1);
      };
    }
  }, [milestoneJustCompleted, completedMilestones, controls, onAnimationComplete]);
  

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollPositions = [0, scrollContainerRef.current.scrollWidth / 2 - scrollContainerRef.current.clientWidth / 2, scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth];
      scrollContainerRef.current.scrollTo({
        left: scrollPositions[completedMilestones] || 0,
        behavior: 'smooth',
      });
    }
  }, [completedMilestones]);

  const remainingGoblins = Math.max(0, 3 - completedMilestones - 1);

  return (
    <div ref={scrollContainerRef} className="relative w-[500px] h-[100px] md:w-[800px] md:h-[100px] rounded-lg overflow-hidden bg-[#FFF7D6] md:overflow-hidden overflow-x-scroll">
      <div className="absolute w-[800px] h-[100px]">
        <Image
          src="/icons/goal-knight/knight-ground.png"
          alt="Knight Grounds"
          width={800}
          height={100}
          className="absolute left-0 bottom-0 h-[100px]"
          onContextMenu={(e) => e.preventDefault()}
        />
        {completedMilestones > 0 && (
          <Image
            src="/icons/goal-knight/castle.png"
            alt="Castle"
            width={54}
            height={100}
            className="absolute left-[5%] bottom-4 h-[100px]"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        {completedMilestones > 1 && (
          <Image
            src="/icons/goal-knight/castle.png"
            alt="Castle"
            width={54}
            height={100}
            className="absolute left-[45%] bottom-4 h-[100px]"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        <motion.div
          initial={{ left: knightVSgoblinPositions[completedMilestones]?.left || '0%', bottom: '0px' }}
          animate={controls}
          style={{ position: 'absolute' }}
        >
          <Image
            src={knightImage}
            alt="Knight and Goblin"
            height={knightDimensions.height}
            width={knightDimensions.width}
            onContextMenu={(e) => e.preventDefault()}
          />
        </motion.div>
        {[...Array(remainingGoblins)].map((_, index) => (
          <Image
            key={index}
            src="/icons/goal-knight/goblin.png"
            alt="Goblin"
            className="absolute"
            height={100}
            width={100}
            style={positions[completedMilestones + index + 1]}
            onContextMenu={(e) => e.preventDefault()}
          />
        ))}
      </div>
    </div>
  );
};

export default VisualKnight;
