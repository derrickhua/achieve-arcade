import React, { useState } from "react";
import './habits.css';
import HabitHeatmap from "../habit-farm/HabitHeatMap";
import HabitBarGraph from "../habit-farm/HabitBarGraph";
import HabitIncrement from "../habit-farm/HabitIncrement";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateHabitCompletion } from '@/lib/habit';
import { Bolt, X } from 'lucide-react';

interface Occurrence {
  date: string;
  completions: number;
}

interface Habit {
  _id: string;
  name: string;
  streak: number;
  habitPeriod: string;
  consistencyGoals: {
    goal: number;
    effectiveDate: string;
  };
  occurrences: Occurrence[];
  heatmapData: { date: string; completions: number }[];
}

const DataVisualSection: React.FC<{ habit: Habit }> = ({ habit }) => {
  const [collapsed, setIsCollapsed] = useState(false);
  const [updatedHabit, setUpdatedHabit] = useState(habit);

  const toggleCollapse = () => setIsCollapsed(!collapsed); // Toggle function for collapse
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formattedDate = today.toISOString();
  // Find today's occurrence or use a fallback
  const todaysOccurrence = updatedHabit.occurrences.find(occ => new Date(occ.date).toDateString() === today.toDateString()) || {
    date: formattedDate,
    completions: 0
  };

  const recalculateHeatmapData = (occurrences: Occurrence[]) => {
    const occurrenceMap: { [key: string]: number } = {};
    occurrences.forEach(occ => {
      const dateKey = new Date(occ.date).toISOString().split('T')[0];
      occurrenceMap[dateKey] = occ.completions;
    });

    const heatmapData = updatedHabit.heatmapData.map(data => {
      const dateKey = new Date(data.date).toISOString().split('T')[0];
      return {
        date: dateKey,
        completions: occurrenceMap[dateKey] || 0
      };
    });

    return heatmapData;
  };

  const handleCompletionUpdate = async (newCount: number) => {
    try {
      await updateHabitCompletion(updatedHabit._id, newCount, formattedDate);
      const updatedOccurrences = updatedHabit.occurrences.map(occ => 
        new Date(occ.date).toDateString() === today.toDateString() ? { ...occ, completions: newCount } : occ
      );
      const updatedHeatmapData = recalculateHeatmapData(updatedOccurrences);
      setUpdatedHabit({
        ...updatedHabit,
        occurrences: updatedOccurrences,
        heatmapData: updatedHeatmapData
      });
    } catch (error) {
      console.error('Error updating completions:', error);
    }
  };

  return (
    <div className={`habit-data h-[200px] shadow-md border border-[5px] border-[#C0D470] relative ${collapsed ? 'collapsed' : ''} bg-[#E9D0A6]`}>
      <div className="absolute top-0 right-4 flex space-x-2">
        <button onClick={() => console.log("Edit Goal")}>
          <Bolt size={34} strokeWidth={2} />
        </button>
        <button 
          className='text-[#EB5757] text-[30px] hover:text-[#F2994A]'
          onClick={() => console.log("Delete Goal")}
        >
          <X size={24} />
        </button>
      </div>
      <div className="habit-name col-span-12 md:col-span-3 flex flex-col justify-center text-[30px]">
        <div className="py-4 h-full flex flex-col justify-around">
          <p className="text-[40px]">{updatedHabit.name}</p>
          <p className="text-[20px]">streak: {updatedHabit.streak}🔥</p>

          <div className="text-[20px] pointer-cursor">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  consistency goal 🛈: {updatedHabit.consistencyGoals.goal} / {updatedHabit.habitPeriod}
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
        <HabitHeatmap data={updatedHabit.heatmapData} />
      </div>

      <div className="habit-bar-graph col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitBarGraph occurrences={updatedHabit.occurrences} consistencyGoals={[updatedHabit.consistencyGoals]} habitPeriod={updatedHabit.habitPeriod} />
      </div>
      {/* New Increment Area Div */}
      <div className="habit-increment-area col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitIncrement
          habitId={updatedHabit._id}
          initialCount={todaysOccurrence.completions}
          onUpdateCompletion={handleCompletionUpdate}
        />
      </div>
      <div className="corner-borders"></div>
    </div>
  );
};

export default DataVisualSection;
