import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { X, Milestone, FlameKindling,Flame, Settings } from 'lucide-react';
import { deleteMilestone, completeMilestone } from '@/lib/goals';
import { EditMilestone } from './EditMilestone';
import './goal.css'
// Define the type for each milestone
interface Milestone {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    completed: boolean;
    completionDate?: string;
}

// Props expected by the MilestoneTimeline component
interface MilestoneTimelineProps {
    milestones: Milestone[];
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    goalId: string;
}


const MilestoneTimeline: React.FC<MilestoneTimelineProps>  = ({ milestones, expanded, setExpanded, goalId }) => {
    const [localMilestones, setLocalMilestones] = useState<Milestone[]>(milestones);
    const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
    const [nextMilestoneIndex, setNextMilestoneIndex] = useState<number | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const findFirstIncompleteMilestone = (milestones: Milestone[]): number => {
        return milestones.findIndex(milestone => !milestone.completed);
    };

    useEffect(() => {
        setLocalMilestones(milestones);
        const index = milestones.findIndex(milestone => !milestone.completed);
        setNextMilestoneIndex(index);
        setCurrentMilestone(index !== -1 ? milestones[index] : null);
    }, [milestones]);

    const handleMarkComplete = (id: string) => {
        completeMilestone(goalId, id).then((completedMilestone) => {
            const updatedMilestones = localMilestones.map(milestone => {
                if (milestone._id === id) {
                    return { ...milestone, completed: true, completionDate: completedMilestone.completionDate || new Date().toISOString() };
                }
                return milestone;
            });
            setLocalMilestones(updatedMilestones);
    
            if (currentMilestone && currentMilestone._id === id) {
                setCurrentMilestone({...currentMilestone, completed: true, completionDate: completedMilestone.completionDate || new Date().toISOString()});
            }
    
            const newIndex = findFirstIncompleteMilestone(updatedMilestones);
            setNextMilestoneIndex(newIndex);
        }).catch(error => {
            console.error("Failed to mark milestone as complete:", error);
        });
    };

    const totalMilestones = localMilestones.length;
    const progressWidth = nextMilestoneIndex === -1 ? 100 : (nextMilestoneIndex === 0 ? 0 : (nextMilestoneIndex / (totalMilestones - 1)) * 100);
    
    
    const updateLocalMilestone = (updatedMilestoneData: Milestone): void => {
        const updatedMilestones = localMilestones.map(milestone =>
            milestone._id === updatedMilestoneData._id ? updatedMilestoneData : milestone
        );
        setLocalMilestones(updatedMilestones);
        setCurrentMilestone(updatedMilestoneData);  // Update current milestone display
    };

    const handleMilestoneDelete = (id: string) => {
        deleteMilestone(goalId, id).then(() => {
            const updatedMilestones = localMilestones.filter(milestone => milestone._id !== id);
            setLocalMilestones(updatedMilestones);

            if (currentMilestone && currentMilestone._id === id) {
                setCurrentMilestone(null);
            }

            const newIndex = updatedMilestones.findIndex(milestone => !milestone.completed);
            setNextMilestoneIndex(newIndex);
            if (newIndex !== -1) {
                setCurrentMilestone(updatedMilestones[newIndex]);
            }
        }).catch(error => {
            console.error("Failed to delete milestone:", error);
        });
    };
    

    return (
        <div className={`relative flex flex-col  items-center ${expanded ? 'h-auto py-4' : 'h-[50px]'} transition-height duration-300 ease-in-out`}>

            {expanded && (
                <div className="w-full flex flex-col items-center mb-4">

                    <div className="flex space-x-2 mb-3 gap-4 ">
                        {localMilestones.map((milestone, index) => (
                            <button
                                key={index}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg border ${milestone._id === currentMilestone._id ? 'bg-[#98E4A5]' : 'bg-white text-black'} border-gray-400`}
                                onClick={() => setCurrentMilestone(milestone)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className={`w-full p-4 bg-white shadow rounded-lg flex justify-between items-center flex-col ${expanded ? 'mb-[40px]' : ''}`}>
                        <div className='flex w-full flex-col'>
                            <span className='flex items-center justify-between'>
                                <div className="text-[18px] font-bold mr-2 flex"><Milestone className='mr-2'/>{currentMilestone.title}</div>
                                <span className='flex items-center'>
                                    <p className="text-sm text-gray-500 mr-[10px] hidden-on-goal">Deadline: {new Date(currentMilestone.deadline).toLocaleDateString()}</p>
                                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                        <DialogTrigger asChild>
                                               <button className="text-gray">
                                                    <Settings size={20} /> {/* Lucide icon for the close button */}
                                                </button> 
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Milestone</DialogTitle>
                                                <DialogDescription>Update the details of your milestone.</DialogDescription>
                                            </DialogHeader>
                                            <EditMilestone 
                                                milestoneId={currentMilestone._id} 
                                                goalId={goalId} 
                                                updateLocalMilestone={updateLocalMilestone}
                                                initialData={currentMilestone}  // Pass initial data for controlled inputs
                                                setEditState={setEditOpen}  // Close the dialog after editing
                                            /> 
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog >
                                        <DialogTrigger asChild>
                                                <button className="text-red-500">
                                                    <X size={24} /> {/* Lucide icon for the close button */}
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete the step and remove its data from our servers.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <button className="bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2 mr-2">
                                                            Cancel
                                                        </button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                    <button onClick={() => handleMilestoneDelete(currentMilestone._id)} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
                                                        Delete
                                                    </button>
                                                    </DialogClose>

                                                </DialogFooter>
                                            </DialogContent>
                                    </Dialog>
                                </span>
                            </span>
                            <p className='text-[15px]'>{currentMilestone.description}</p>
                        </div>
                        <button
                            onClick={() => handleMarkComplete(currentMilestone._id)}
                            className={`px-2 py-2 mt-4 rounded border hover:bg-[#008000] hover:text-white ${currentMilestone.completed ? 'text-white bg-[#008000]' : 'bg-white text-[#008000] border-[#008000]'}`}
                            disabled={currentMilestone.completed}
                        >
                            {currentMilestone.completed ? 'Completed' : 'Mark Complete'}
                        </button>
                    </div>
                </div>
            )}
          <div className={`w-full bg-gray-500 h-1.5 rounded-xl relative`}>
                <div className="bg-[#008000] h-1.5 rounded-full flex items-center" style={{ width: `${progressWidth}%` }}>
                {localMilestones.map((milestone, index) => (
                <div key={index} className="milestone-circle" style={{ left: `${(index / (totalMilestones - 1)) * 100}%` }}>
                    <div className={`w-4 h-4 rounded-lg flex items-center justify-center border-2 ${milestone.completed ? "bg-[#008000] border-[#008000]" : "bg-white border-gray-500"}`} title={milestone.title}></div>
                    {milestone.completed ? <Flame className="icon" color='#008000' /> : index === nextMilestoneIndex ? <FlameKindling className="icon" color='#008000'/> : null}
                </div>
            ))}
                </div>
            </div>



            {!expanded ? 
                <ChevronDown onClick={()=> setExpanded(true)} size={35} className='mt-[8px] cursor-pointer hover:bg-gray-200'/>
            :
                <ChevronUp onClick={()=> setExpanded(false)} size={35} className='mt-2 mb-[-15px] cursor-pointer hover:bg-gray-200'/>
            }
        </div>
    );
};

export default MilestoneTimeline;
