import React from "react";
import './habits.css';
import HabitHeatmap from "./HabitHeatMap";
import HabitBarGraph from "./HabitBarGraph";
import HabitPerformance from "./HabitPerformance";
import HabitIncrement from "./HabitIncrement";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
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
import { sampleConsistencyGoals, sampleHabitPeriod, sampleHeatmapData, sampleOccurrences, samplePerformanceRate } from "./HabitSampleData";
import { X, Minus, Plus } from 'lucide-react';
import { useState } from "react";

interface Occurrence {
  date: string;
  completions: number;
}

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
  occurrences: Occurrence[];
  performanceRate: {
    consistencyRate: number;
    totalCompletions: number;
    totalPossibleCompletions: number;
  };
  heatmapData: Array<any>;
}

const HabitDataVisualizer: React.FC<{ habit: Habit}> = ({ habit }) => {
  const [collapsed, setIsCollapsed] = useState(false);  

  const toggleCollapse = () => setIsCollapsed(!collapsed);  // Toggle function for collapse
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formattedDate = today.toISOString();
  // Find today's occurrence or use a fallback
  const todaysOccurrence = habit.occurrences.find(occ => new Date(occ.date).toDateString() === today.toDateString()) || {
    date: formattedDate,
    completions: 0
  };
  return (
    <div className={`habit-data shadow-lg border relative ${collapsed ? 'collapsed' : ''}`}>
      <div className="habit-name col-span-12 md:col-span-3 flex flex-col justify-center text-[30px]">
        <div className=" my-2">
            <p className="my-2 stardom">{habit.name}</p>
            <hr />
            <p className="text-[18px] mt-2 garamond">streak: {habit.streak}🔥</p>
            <hr />
            <div className="text-[18px] mt-2 garamond pointer-cursor">
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
            </div>
        </div>
      </div>
      <div className="habit-heatmap col-span-12 md:col-span-3 flex justify-center items-center">
        <HabitHeatmap data={sampleHeatmapData} />
      </div>


      <div className="habit-bar-graph col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitBarGraph occurrences={sampleOccurrences} consistencyGoals={sampleConsistencyGoals} habitPeriod={sampleHabitPeriod} />
      </div>
      <div className="habit-progress-circle garamond col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitPerformance performanceRate={samplePerformanceRate} />
      </div>
      {/* New Increment Area Div */}
      <div className="habit-increment-area col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitIncrement 
            habitId={habit._id}
            initialCount={todaysOccurrence.completions}
        />
      </div>

    </div>
  );
};

export default HabitDataVisualizer;
