import React, { useState, useEffect } from 'react';
import { Check, Bolt, Lock } from 'lucide-react';
import { completeMilestone, getMilestones, Milestone } from '@/lib/goals'; 
import EditMilestoneForm from '../forms/EditMilestone';

const MilestoneSection: React.FC<{ milestones: Milestone[], goalId: string, onMilestoneComplete: () => void, setGoalComplete: () => void, disableButton: boolean }> = ({ milestones, goalId, onMilestoneComplete, setGoalComplete, disableButton }) => {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);
  const [milestoneList, setMilestoneList] = useState(milestones);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(!milestones.length);

  useEffect(() => {
    const firstIncompleteIndex = milestoneList.findIndex(milestone => !milestone.completed);
    setSelectedMilestoneIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
  }, [milestoneList]);

  useEffect(() => {
    if (!milestoneList.length) {
      const intervalId = setInterval(async () => {
        const fetchedMilestones = await getMilestones(goalId);
        if (fetchedMilestones.length) {
          setMilestoneList(fetchedMilestones);
          setIsLoading(false);
          clearInterval(intervalId);
        }
      }, 10000);
      return () => clearInterval(intervalId); // Clear the interval on component unmount
    }
  }, [milestoneList, goalId]);

  const handleCompleteMilestone = async () => {
    if (disableButton) return; // Prevent clicking while disabled

    const milestoneId = milestoneList[selectedMilestoneIndex]?._id;
    const isLastMilestone = selectedMilestoneIndex === milestoneList.length - 1;
    try {
      const updatedMilestone = await completeMilestone(goalId, milestoneId, isLastMilestone);
      setMilestoneList(prevMilestones =>
        prevMilestones.map((milestone, index) =>
          index === selectedMilestoneIndex ? updatedMilestone : milestone
        )
      );
      onMilestoneComplete();
      if (isLastMilestone) {
        setGoalComplete();
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  };

  const handleOpenEditForm = async () => {
    const milestones = await getMilestones(goalId);
    const milestone = milestones.find(m => m._id === milestoneList[selectedMilestoneIndex]?._id);
    setSelectedMilestone(milestone || null);
    setIsEditFormVisible(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormVisible(false);
  };

  useEffect(() => {
    setMilestoneList(milestones);
  }, [milestones]);

  return (
    <div className="mt-4 flex justify-center items-start h-[150px] w-full">
      <div className="flex flex-col justify-around h-[150px] mr-4">
        {milestoneList.map((_, index) => (
          <button
            key={index}
            className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg ${
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
        <div className="absolute top-0 right-3 m-2 flex space-x-1 z-10">
            <button className="text-black" onClick={handleOpenEditForm}>
            <Bolt size={20} strokeWidth={2} />
            </button>
        </div>
        <div className='w-3/4'>
            <div className="text-[25px] mb-2">
                {isLoading || !milestoneList[selectedMilestoneIndex] ? 'Loading...' : `QUEST #${selectedMilestoneIndex + 1}: ${milestoneList[selectedMilestoneIndex].title}`}
            </div>
            <div className="text-[15px]">description:</div>
            <div className="text-[15px] break-words mb-2">
                {isLoading || !milestoneList[selectedMilestoneIndex] ? 'Loading...' : milestoneList[selectedMilestoneIndex].description}
            </div>
        </div>
        <div className='w-1/4 flex justify-center'>
            <div 
                className={`m-2 h-[60px] w-[60px] space-x-1 hover:bg-[#6FCF97] ${disableButton ? 'bg-gray-300 cursor-not-allowed' : milestoneList[selectedMilestoneIndex]?.completed ? 'bg-[#6FCF97] text-black' : 'bg-transparent'} 
                        border-2 border-black rounded-xl flex cursor-pointer items-center justify-center`}
                onClick={handleCompleteMilestone}
            >
                {disableButton ? <Lock size={50} className={`text-black`} /> : <Check size={50} className={`text-black`} />}
            </div>
        </div>
      </div>

      {isEditFormVisible && selectedMilestone && (
        <EditMilestoneForm
          milestone={selectedMilestone}
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
