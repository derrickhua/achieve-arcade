import React, { useState, useEffect } from 'react';
import { Check, Bolt, Lock } from 'lucide-react';
import { completeMilestone, getMilestones, Milestone } from '@/lib/goals'; 
import EditMilestoneForm from '../forms/EditMilestone';

const MilestoneSection: React.FC<{ milestones: Milestone[], goalId: string, onMilestoneComplete: () => void, setGoalComplete: () => void, disableButton: boolean }> = ({ milestones, goalId, onMilestoneComplete, setGoalComplete, disableButton }) => {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number | null>(null);
  const [milestoneList, setMilestoneList] = useState<Milestone[]>(milestones);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(!milestones.length);

  useEffect(() => {
    const initializeMilestones = async () => {
      const fetchedMilestones = await getMilestones(goalId);
      setMilestoneList(fetchedMilestones);
      setIsLoading(false);
      const firstIncompleteIndex = fetchedMilestones.findIndex(milestone => !milestone.completed);
      setSelectedMilestoneIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
    };

    if (!milestoneList.length) {
      initializeMilestones();
    } else {
      const firstIncompleteIndex = milestoneList.findIndex(milestone => !milestone.completed);
      setSelectedMilestoneIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
    }
  }, [milestoneList, goalId]);

  const handleCompleteMilestone = async () => {
    if (disableButton || selectedMilestoneIndex === null) return; // Prevent clicking while disabled

    const milestoneId = milestoneList[selectedMilestoneIndex]?._id;
    const isLastMilestone = selectedMilestoneIndex === milestoneList.length - 1;
    console.log(`Completing milestone: ${milestoneId}, isLastMilestone: ${isLastMilestone}`); // Log for debugging

    try {
      const updatedMilestone = await completeMilestone(goalId, milestoneId, isLastMilestone);
      console.log('Milestone updated:', updatedMilestone); // Log for debugging

      setMilestoneList(prevMilestones =>
        prevMilestones.map((milestone, index) =>
          index === selectedMilestoneIndex ? updatedMilestone : milestone
        )
      );

      onMilestoneComplete();
      console.log('onMilestoneComplete called'); // Log for debugging

      if (isLastMilestone) {
        console.log('Setting goal complete'); // Log for debugging
        setGoalComplete();
      } else {
        const nextIncompleteIndex = milestoneList.findIndex((milestone, index) => index > selectedMilestoneIndex && !milestone.completed);
        setSelectedMilestoneIndex(nextIncompleteIndex !== -1 ? nextIncompleteIndex : selectedMilestoneIndex + 1);
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  };

  const handleOpenEditForm = async () => {
    console.log('Opening edit form for goalId:', goalId);
    const fetchedMilestones = await getMilestones(goalId);
    console.log('Fetched milestones:', fetchedMilestones);
    
    const milestone = fetchedMilestones[selectedMilestoneIndex];
    console.log('Selected milestone:', milestone);
    
    setIsEditFormVisible(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormVisible(false);
  };

  useEffect(() => {
    setMilestoneList(milestones);
    const firstIncompleteIndex = milestones.findIndex(milestone => !milestone.completed);
    setSelectedMilestoneIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
  }, [milestones]);

  return (
    <div className="mt-4 flex flex-col md:flex-row items-center h-auto md:h-[150px] w-full">
      <div className="flex md:flex-col flex-row justify-center md:justify-around md:h-[150px] w-full md:w-auto mb-4 md:mb-0 md:mr-8">
        {milestoneList.map((_, index) => (
          <button
            key={index}
            className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg mx-1 md:mx-0 ${
              index === selectedMilestoneIndex ? 'bg-black text-[#FEFDF2] border-black' : 'bg-[#FEFDF2] border-black text-black'
            }`}
            onClick={() => setSelectedMilestoneIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="relative flex items-center justify-between max-w-[700px] h-full w-full bg-[#FEFDF2] border border-black rounded-lg p-4 z-0">
        <div className="absolute top-[-22px] left-[-24px] w-[64px] h-[64px] z-10" style={{ backgroundImage: "url('/icons/goal-knight/top-left.png')", backgroundSize: 'contain' }}></div>
        <div className="absolute top-[-22px] right-[-24px] w-[64px] h-[64px] z-10" style={{ backgroundImage: "url('/icons/goal-knight/top-right.png')", backgroundSize: 'contain' }}></div>
        <div className="absolute bottom-[-22px] left-[-24px] w-[64px] h-[64px] z-10" style={{ backgroundImage: "url('/icons/goal-knight/bot-left.png')", backgroundSize: 'contain' }}></div>
        <div className="absolute bottom-[-22px] right-[-24px] w-[64px] h-[64px] z-10" style={{ backgroundImage: "url('/icons/goal-knight/bot-right.png')", backgroundSize: 'contain' }}></div>
        {!isLoading && 
        <div className="absolute top-0 right-3 m-2 flex space-x-1 z-10">
          <button className="text-black" onClick={handleOpenEditForm}>
            <Bolt size={20} strokeWidth={2} />
          </button>
        </div> 
        }
        <div className='w-3/4'>
          <div className="text-[16px] md:text-[25px] mb-2">
            {isLoading || selectedMilestoneIndex === null || !milestoneList[selectedMilestoneIndex] ? 'Loading Quests...' : `QUEST #${selectedMilestoneIndex + 1}: ${milestoneList[selectedMilestoneIndex].title}`}
          </div>
          <div className="hidden md:block text-[15px]">description:</div>
          <div className="hidden md:block text-[15px] break-words mb-2">
            {isLoading || selectedMilestoneIndex === null || !milestoneList[selectedMilestoneIndex] ? 'Loading...' : milestoneList[selectedMilestoneIndex].description}
          </div>
        </div>
        {!isLoading && 
        <div className="w-1/4 flex justify-center">
          <div 
            className={`m-2 h-[42px] w-[42px] mr-8 md:mr-0 md:h-[60px] md:w-[60px] space-x-1 ${
              disableButton || milestoneList.slice(0, selectedMilestoneIndex).some(milestone => !milestone.completed)
                ? 'bg-gray-300 cursor-not-allowed'
                : milestoneList[selectedMilestoneIndex]?.completed
                  ? 'bg-[#6FCF97] text-black cursor-not-allowed'
                  : 'hover:bg-[#6FCF97] bg-transparent'
            } border-2 border-black rounded-xl flex cursor-pointer items-center justify-center`}
            onClick={() => {
              if (!disableButton && !milestoneList[selectedMilestoneIndex]?.completed && !milestoneList.slice(0, selectedMilestoneIndex).some(milestone => !milestone.completed)) {
                handleCompleteMilestone();
              }
            }}
          >
            {disableButton || milestoneList.slice(0, selectedMilestoneIndex).some(milestone => !milestone.completed)
              ? <Lock size={35} className="text-black" />
              : milestoneList[selectedMilestoneIndex]?.completed
                ? <Check size={35} className="text-black" />
                : <Check size={35} className=" text-black" />}
          </div>
        </div>
        }
      </div>

      {isEditFormVisible && selectedMilestoneIndex !== null && (
        <EditMilestoneForm
          milestone={milestoneList[selectedMilestoneIndex]}
          goalId={goalId}
          onClose={handleCloseEditForm}
          fetchMilestones={async () => {
            const milestones = await getMilestones(goalId);
            setMilestoneList(milestones);
          }}
        />
      )}
    </div>
  );
};

export default MilestoneSection;
