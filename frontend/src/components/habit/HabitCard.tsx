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

const HabitCard: React.FC<{ habit: Habit, deleteHabit: (id: string) => void }> = ({ habit, deleteHabit }) => {
  const [collapsed, setIsCollapsed] = useState(false);  

  const toggleCollapse = () => setIsCollapsed(!collapsed);  // Toggle function for collapse
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formattedDate = today.toISOString();
  console.log(habit)
  // Find today's occurrence or use a fallback
  const todaysOccurrence = habit.occurrences.find(occ => new Date(occ.date).toDateString() === today.toDateString()) || {
    date: formattedDate,
    completions: 0
  };
  return (
    <div className={`habit-card shadow-lg relative ${collapsed ? 'collapsed' : ''}`}>
        <button className="absolute right-10 top-2 text-gray-500" onClick={toggleCollapse}>
            {
              collapsed ? <Plus /> : <Minus />
            }
          </button>
        <Dialog>
          <DialogTrigger asChild>
            <button className="absolute right-2 top-2 text-red-500">
              <X /> {/* Assuming you use some icon for the 'X' */}
            </button>
          </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the habit and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <div className="flex justify-end space-x-2">
              <button onClick={() => deleteHabit(habit._id)} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
                Delete
              </button>
            </div>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <div className="habit-name col-span-12 md:col-span-3 flex flex-col justify-center text-[30px]">
        <div className="stardom my-2">
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
      {
        !collapsed && (
          <>
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
          </>
        )
      }
    </div>
  );
};

export default HabitCard;
