import React, { useState, useEffect } from 'react';
import { Bolt } from 'lucide-react';
import MilestoneSection from './MilestoneSection'; // Adjust the path based on your file structure
import VisualKnight from './VisualKnight'; // Adjust the path based on your file structure
import GoalSuccess from './GoalSuccess'; // Adjust the path based on your file structure

const GoalCard: React.FC<{ goal: any, onOpenEditGoalForm: (id: string) => void, onOpenDeleteGoalForm: (id: string) => void, fetchCoins: () => void }> = ({ goal, onOpenEditGoalForm, onOpenDeleteGoalForm, fetchCoins }) => {
  const [completedMilestones, setCompletedMilestones] = useState(goal.milestones.filter(milestone => milestone.completed).length);
  const [goalCompleted, setGoalCompleted] = useState(goal.completed);
  const [milestoneJustCompleted, setMilestoneJustCompleted] = useState(false);
  const [showKnightSlash, setShowKnightSlash] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  console.log('the goal i received', goal);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    const date = new Date();
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    if (goal.milestones.length > 0 && completedMilestones === goal.milestones.length) {
      setGoalCompleted(true);
    }
  }, [completedMilestones, goal.milestones.length]);

  const handleMilestoneCompletion = () => {
    if (isAnimating) return; // Prevent double clicking
    
    setMilestoneJustCompleted(true);
    setIsAnimating(true);
  };

  const handleAnimationComplete = async () => {
    setMilestoneJustCompleted(false);
    setCompletedMilestones(prev => {
      const newCount = prev + 1;
      if (newCount === goal.milestones.length) {
        setShowKnightSlash(true);
      }
      return newCount;
    });
    setIsAnimating(false);
    await fetchCoins(); // Fetch user coins after each milestone completion
  };

  const handleFinalAnimationComplete = async () => {
    setGoalCompleted(true);
    setShowKnightSlash(false);
    setIsAnimating(false);
    await fetchCoins();
  };

  return (
    <div className="relative h-[468px] rounded-3xl border-black border-[3px] bg-[#FEFDF2] p-6">
      {goalCompleted ? (
        <GoalSuccess 
          goalName={goal.title} 
          completionDate={getCurrentDate()}
        />
      ) : (
        <>
          <div className="absolute top-0 right-4 flex space-x-2">
            <button onClick={() => onOpenEditGoalForm(goal._id)}>
              <Bolt size={24} strokeWidth={2}/>
            </button>
            <button 
              className='text-[#EB5757] text-[30px] hover:text-[#F2994A]'
              onClick={() => onOpenDeleteGoalForm(goal._id)}
            >
              X
            </button>
          </div>
          <div className='flex justify-around items-center mt-4 h-[100px]'>
            <div className='min-w-[300px]'>
              <div className="text-[40px] leading-none">{goal.title}</div>
              <div className="text-[#EB5757] text-[20px] mt-[-8px]">
                deadline: {goal.deadline && formatDate(goal.deadline)}
              </div>
            </div>
            <div className="p-2 text-[15px] w-[400px] mr-6 bg-[#EFE1AB] rounded-lg border-[3px] border-black">
              <div className="">description:</div>
              <div className="break-words">{goal.description}</div>
            </div>
          </div>
          <MilestoneSection milestones={goal.milestones} goalId={goal._id} onMilestoneComplete={handleMilestoneCompletion} setGoalComplete={setGoalCompleted} disableButton={isAnimating} />
          <div className="mt-8 flex justify-center">
            <VisualKnight 
              completedMilestones={completedMilestones} 
              milestoneJustCompleted={milestoneJustCompleted}
              showKnightSlash={showKnightSlash}
              onAnimationComplete={handleAnimationComplete}
              onFinalAnimationComplete={handleFinalAnimationComplete}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GoalCard;
