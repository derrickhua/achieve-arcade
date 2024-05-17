import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";  

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 30; 
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
                strokeWidth="5"  
            />
            <circle
                fill="transparent"
                stroke="#008000"
                cx="50"  
                cy="50" 
                r={radius}
                strokeWidth="5"  
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

interface DeadlineAdherenceProps {
    percentage: number;  // Type explicitly as a number
}

const DeadlineAdherence: React.FC<DeadlineAdherenceProps> = ({ percentage }) => {
    return (
        <TooltipProvider>
            <div className="flex flex-col items-center justify-center">
                <CircularProgress percentage={percentage} />
                <Tooltip>
                    <TooltipTrigger>
                        <p className="mb-2 cursor-pointer">
                            deadline adherence 🛈
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className='text-[15px]'>Percentage of milestones met by their deadlines, indicating timeliness of task completion.</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
};

export default DeadlineAdherence;
