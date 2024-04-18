import React from 'react';
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Info
  } from "lucide-react"
import './habits.css';
interface Occurrence {
    date: string;
    completions: number;
}

interface ConsistencyGoal {
    goal: number;
    effectiveDate: string;
}

interface HabitBarGraphProps {
    occurrences: Occurrence[];
    habitPeriod: 'Daily' | 'Weekly';
    consistencyGoals: ConsistencyGoal[];
}

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

const HabitBarGraph: React.FC<HabitBarGraphProps> = ({ occurrences, habitPeriod, consistencyGoals }) => {
    const maxCompletions = Math.max(...occurrences.map(o => o.completions));
    const totalCompletions = occurrences.reduce((acc, cur) => acc + cur.completions, 0);
    const baseGoal = consistencyGoals.reduce((acc, goal) => acc + goal.goal, 0);
    const weeklyGoal = habitPeriod === 'Daily' ? baseGoal * 7 : baseGoal;
    const completionPercentage = weeklyGoal > 0 ? (totalCompletions / weeklyGoal) * 100 : 0;

    return (
        <TooltipProvider>
            <div className="w-full flex flex-col items-center h-full garamond">
                <div className="flex items-center">
                    activity in the past week
                </div>
                <div className="flex flex-grow justify-between w-full px-2 relative" style={{ alignItems: 'flex-end' }}>
                    {occurrences.map((occurrence, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger 
                                className="flex flex-col justify-end items-center flex-grow" 
                                style={{ height: '100%' }}
                            >
                                <span className='text-[12px] mb-2 ' style={{ color: '#98E4A5' }}>
                                    {daysOfWeek[index]}
                                </span>
                                <div
                                    style={{
                                        height: `${(occurrence.completions / maxCompletions) * 100}%`,
                                        width: '80%',
                                        borderRadius: '5px',
                                        backgroundColor: '#98E4A5',
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                    className="flex max-w-[35px] bar"
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{occurrence.completions} completions</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                <div className="w-full mt-4 flex flex-col items-center">
                    <Progress value={Math.min(completionPercentage, 100)} />
                </div>
            </div>
        </TooltipProvider>
    );
};
export default HabitBarGraph;
