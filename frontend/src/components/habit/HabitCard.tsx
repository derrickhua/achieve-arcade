import { completeHabit } from "@/lib/habit";
import React from "react";
import HabitHeatmap from "./HabitHeatMap";
import HabitBarGraph from "./HabitBarGraph";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import './habits.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { sampleConsistencyGoals, sampleHabitPeriod, sampleHeatmapData, sampleOccurrences, samplePerformanceRate } from "./HabitSampleData";
import HabitPerformance from "./HabitPerformance";
// Define the Habit interface
interface Habit {
  _id: string;
  name: string;
  streak: number;
  habitPeriod: string;
  latestGoal: {
    goal: number;
    effectiveDate: string;
  };
  consistencyGoals: Array<any>;
  occurrences: Array<any>; 
  performanceRate: {
    consistencyRate: number;
    totalCompletions: number;
    totalPossibleCompletions: number;
  };
  heatmapData: Array<any>; // Specify more detailed types as needed
}


const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => {
  console.log(habit);
  return (
      <div className="habit-card bg-white border rounded-xl mb-4 p-4 grid grid-cols-12 gap-4 max-h-[15vh] min-h-[200px]">
          <div className="habit-name col-span-12 md:col-span-3 flex flex-col justify-center text-[30px]">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel className="my-2 stardom">{habit.name}</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="text-[18px] mt-2 garamond">streak: {habit.streak}🔥</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="text-[18px] mt-2 garamond">
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  consistency goal 🛈: {habit.latestGoal.goal} / {habit.habitPeriod}
                </TooltipTrigger>
                <TooltipContent>
                  <p>The total number of habits that should be completed within the habit period.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            </ResizablePanel>
          </ResizablePanelGroup>
          </div>
          <div className="habit-heatmap col-span-12 md:col-span-4 flex justify-center items-center"> {/* Adjusted col-span */}
              <HabitHeatmap data={sampleHeatmapData} />
          </div>
          <div className="habit-bar-graph col-span-12 md:col-span-3 flex justify-center items-center"> {/* Adjusted col-span */}
              <HabitBarGraph occurrences={sampleOccurrences} consistencyGoals={sampleConsistencyGoals} habitPeriod={sampleHabitPeriod} />
          </div>
          <div className="habit-progress-circle garamond col-span-12 md:col-span-2 flex justify-center items-center">
            <HabitPerformance performanceRate={samplePerformanceRate} />
          </div>
      </div>
  );
};

export default HabitCard;
