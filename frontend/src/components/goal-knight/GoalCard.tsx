import React from 'react';
import { Bolt } from 'lucide-react';
import MilestoneSection from './MilestoneSection'; // Make sure the path is correct based on your file structure

const GoalCard: React.FC<{ goal: any, onOpenEditGoalForm: (id: string) => void, onOpenDeleteGoalForm: (id: string) => void }> = ({ goal, onOpenEditGoalForm, onOpenDeleteGoalForm }) => {

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="relative rounded-3xl border-black border-[3px] bg-[#FEFDF2] p-6">
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
      <MilestoneSection milestones={goal.milestones} goalId={goal._id}/>
      <div className="mt-4">
        {/* Placeholder for the bottom portion (graphics) */}
        <div className="border border-dashed border-gray-400 p-4 rounded-lg">
          Bottom Portion
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
