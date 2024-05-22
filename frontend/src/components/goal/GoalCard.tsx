import { useState, useEffect } from "react";
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
import { X, Target, SquarePen, HandHeart, Settings } from 'lucide-react';
import DeadlineAdherence from "./DeadlineAdherence";
import GoalVelocity from "./GoalVelocity";
import MilestoneTimeline from "./MilestoneTimeline";
import { EditGoal } from "./EditGoal";
import Loader from "./GoalLoader";
import { getGoalMilestones, Goal, Milestone, GoalUpdateData } from "@/lib/goals";
import './goal.css'
interface GoalCardProps {
    goal: Goal;
    onDelete: (goalId: string) => void;
    onUpdate: (updatedGoal: Goal) => void;
  }

export default function GoalCard({ goal, onDelete, onUpdate }: GoalCardProps) {
    const [expanded, setExpanded] = useState(false);
    const deadlineAdherence = goal.metrics.deadlineAdherence.milestones;
    const goalVelocity = goal.metrics.goalVelocity ? goal.metrics.goalVelocity : 0;
    const [milestones, setMilestones] = useState<Milestone[]>(goal.milestones);
    const [hasMilestones, setHasMilestones] = useState(goal.milestones && goal.milestones.length > 0);
    const [goalEdit, setGoalEdit] = useState(false)

    useEffect(() => {
        const pollForMilestones = () => {
            if (milestones.length === 0) {  
                const intervalId = setInterval(() => {
                    getGoalMilestones(goal._id)
                        .then(data => {
                            if (data && data.length > 0) {
                                setMilestones(data);  // Update milestones 
                                setHasMilestones(true)
                                clearInterval(intervalId);  // Stop polling once milestones are fetched
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching milestones:", error);
                        });
                }, 3000); // Poll every 3 seconds

                return () => clearInterval(intervalId);  // Cleanup the interval on component unmount
            }
        };

        pollForMilestones();
    }, [goal._id, milestones.length]);

    const updateLocalGoal = (updatedGoalData: Partial<Goal>) => {
        const updatedGoal = { ...goal, ...updatedGoalData };
        goal = updatedGoal;  // This directly updates the goal prop
        setMilestones(updatedGoal.milestones);
        setHasMilestones(updatedGoal.milestones.length > 0);
    };

    return (
        <div className={`goal-card ${expanded ? "expanded" : "collapsed"}`}>
            
            {hasMilestones &&
                <Dialog open={goalEdit} onOpenChange={setGoalEdit}>
                    <DialogTrigger asChild>
                            <button className="text-gray absolute right-9 top-2.5">
                                <Settings size={20} /> {/* Lucide icon for the close button */}
                            </button> 
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Goal</DialogTitle>
                            <DialogDescription>Update the details of your goal.</DialogDescription>
                        </DialogHeader>
                        <EditGoal
                            goalId={goal._id}
                            initialData={goal}
                            setGoalState={setGoalEdit}
                            updateLocalGoal={onUpdate} // Pass the onUpdate function here
                        />
                    </DialogContent>
                </Dialog>
            }
            {hasMilestones &&
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="absolute right-2 top-2 text-red-500">
                            <X size={24} /> {/* Lucide icon for the close button */}
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete the goal and remove its data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <button className="bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2 mr-2">
                                    Cancel
                                </button>
                            </DialogClose>
                            <DialogClose>
                                <button onClick={() => onDelete(goal._id)} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
                                    Delete
                                </button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
            {
                hasMilestones && 
                <div className={`flex justify-between mb-4 ${!expanded ? 'mb-[40px]' :''}`}>
                    <div className="flex flex-col justify-center items-start goal-description ml-[30px]">
                        <h5 className="text-[25px] stardom">{goal.title}</h5>
                        <div className="flex flex-col items-start w-full">
                            <span className="text-[15px] helvetica mt-2 flex items-center">
                                <Target color="#008000" className="mr-2"/>
                                deadline: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                            {expanded && (
                                <>
                                    <div className="text-[15px] helvetica mt-2 w-full">
                                        <div className="flex items-center">
                                            <span className="w-[25px] mr-2">
                                                <SquarePen color="#008000" />
                                            </span>
                                            <span className="flex-wrap">description: {goal.description}
                                            </span>
                                        </div>
                                
                                    </div>
                                    <div className="text-[15px] helvetica mt-2 w-full">
                                        <div className="flex items-center">
                                            <span className="w-[25px] mr-2">
                                                <HandHeart color="#008000" />
                                            </span>                        
                                            <span className="flex-wrap">reason: {goal.reason} 
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex goal-metrics items-center justify-around w-[50%] text-[13px]">
                        <DeadlineAdherence percentage={deadlineAdherence} />
                        <GoalVelocity percentage={goalVelocity} />
                    </div>
                </div>

            }
            {
                hasMilestones &&
                <div className="lower-div relative">
                    <MilestoneTimeline milestones={milestones} expanded={expanded} setExpanded={setExpanded}  goalId={goal._id}/>
                </div>
            }
            {!hasMilestones &&
                <div className="flex items-center justify-center text-[30px] garamond">
                    <Loader />
                </div>
            }
       
        </div>
    );
}
