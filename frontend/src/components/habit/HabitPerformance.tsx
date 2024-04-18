import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";  // Adjust the import path as necessary


// Define the props interface for component
interface HabitPerformanceProps {
    performanceRate: {
        consistencyRate: number,
        totalCompletions: number,
        totalPossibleCompletions: number
    };
}

// A simple SVG circular progress bar component with increased size
const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 40; // Doubled from 20 to 40
    const circumference = 2 * Math.PI * radius;
    const strokePct = ((100 - percentage) * circumference) / 100;
    return (
        <svg width="100" height="100">
            <circle
                fill="transparent"
                stroke="lightgrey"
                cx="50"  // Center of the larger SVG
                cy="50"  // Center of the larger SVG
                r={radius}
                strokeWidth="10"  // Increased to make the stroke thicker
            />
            <circle
                fill="transparent"
                stroke="green"
                cx="50"  // Center of the larger SVG
                cy="50"  // Center of the larger SVG
                r={radius}
                strokeWidth="10"  // Increased to make the stroke visible
                strokeDasharray={circumference}
                strokeDashoffset={strokePct}
                strokeLinecap="round"
                transform="rotate(-90, 50, 50)"  // Adjusted center for rotation
            />
            <text
                x="50%"  // Center text
                y="50%"  // Center text
                dy=".3em"
                textAnchor="middle"
                fontSize="15"  // Larger font size for better readability
                fill="black"
            >
                {`${Math.round(percentage)}%`}
            </text>
        </svg>
    );
};


const HabitPerformance: React.FC<HabitPerformanceProps> = ({ performanceRate }) => {
    return (
        <TooltipProvider>
            <div className="habit-performance flex flex-col items-center justify-center">
                <Tooltip>
                    <TooltipTrigger>
                        <p className="text-[17px] mb-2 cursor-pointer">
                            performance rate 🛈
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>The performance rate shows how consistently you are meeting your goals over time.</p>
                    </TooltipContent>
                </Tooltip>
                <CircularProgress percentage={performanceRate.consistencyRate} />
            </div>
        </TooltipProvider>
    );
};

export default HabitPerformance;