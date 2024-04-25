import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";  

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 40; // Doubled from 20 to 40
    const circumference = 2 * Math.PI * radius;
    const strokePct = ((100 - percentage) * circumference) / 100;
    return (
        <svg width="100" height="100">
            <circle
                fill="transparent"
                stroke="lightgrey"
                cx="50"  
                cy="50"  
                r={radius}
                strokeWidth="10"  
            />
            <circle
                fill="transparent"
                stroke="green"
                cx="50"  
                cy="50" 
                r={radius}
                strokeWidth="10"  
                strokeDasharray={circumference}
                strokeDashoffset={strokePct}
                strokeLinecap="round"
                transform="rotate(-90, 50, 50)"  
            />
            <text
                x="50%"  
                y="50%"  
                dy=".3em"
                textAnchor="middle"
                fontSize="15"  
                fill="black"
            >
                {`${Math.round(percentage)}%`}
            </text>
        </svg>
    );
};


const GoalVelocity = ( percentage:any ) => {
    return (
        <TooltipProvider>
            <div className="habit-performance flex flex-col items-center justify-center">
                <CircularProgress percentage={percentage} />
                <Tooltip>
                    <TooltipTrigger>
                        <p className="text-[17px] mb-2 cursor-pointer">
                            deadline adherence 🛈
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Percentage of milestones met by their deadlines, indicating timeliness of task completion.</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
};

export default GoalVelocity;