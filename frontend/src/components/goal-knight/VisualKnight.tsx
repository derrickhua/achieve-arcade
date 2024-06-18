import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (showKnightSlash) {
      // Play slash animation
      setKnightImage('/icons/goal-knight/knight-slash.gif');
      setKnightDimensions({ width: 180, height: 200 });
      setTimeout(() => {
        // Notify that the final animation is complete
        onFinalAnimationComplete();
      }, 2000); // Duration of slash animation (adjust as needed)
    } else if (milestoneJustCompleted) {
      // Play kill animation
      setKnightImage('/icons/goal-knight/knight-kill.gif');
      setKnightDimensions({ width: 180, height: 100 });
      setTimeout(() => {
        // After kill animation, play walk animation and move the knight
        setKnightImage('/icons/goal-knight/knight-walk.gif');
        setKnightDimensions({ width: 100, height: 100 });

        // Start the animation here
        controls.start({
          left: knightArrivalPositions[completedMilestones],
          transition: { duration: 3 }
        });

        setTimeout(() => {
          // After walk animation, set knight and goblin fight position
          setKnightImage('/icons/goal-knight/knight-fight.png');
          const nextPosition = knightVSgoblinPositions[completedMilestones + 1] || { left: '100%', bottom: '0px' };
          controls.start({
            left: nextPosition.left,
            transition: { duration: 0 }
          });
          setKnightDimensions({ width: 180, height: 100 });
          onAnimationComplete();
        }, 3000); // Extended duration of walk animation
      }, 1050); // Duration of kill animation
    }
  }, [milestoneJustCompleted, completedMilestones, showKnightSlash]);

  const remainingGoblins = Math.max(0, 3 - completedMilestones - 1);

  return (
    <div className="relative w-[800px] h-[100px] rounded-lg overflow-hidden bg-[#FFF7D6]">
      <Image
        src="/icons/goal-knight/knight-ground.png"
        alt="Knight Grounds"
        width={800}
        height={100}
        className="absolute left-0 bottom-0 h-[100px]"
      />
      {completedMilestones > 0 && (
        <Image
          src="/icons/goal-knight/castle.png"
          alt="Castle"
          width={54}
          height={100}
          className="absolute left-[5%] bottom-4 h-[100px]"
        />
      )}
      {completedMilestones > 1 && (
        <Image
          src="/icons/goal-knight/castle.png"
          alt="Castle"
          width={54}
          height={100}
          className="absolute left-[45%] bottom-4 h-[100px]"
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
        />
      ))}
    </div>
  );
};

export default VisualKnight;
