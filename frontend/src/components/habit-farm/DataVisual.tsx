import React, { useState, useEffect } from "react";
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
import { Bolt } from 'lucide-react';

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

interface DataVisualSectionProps {
  habit: Habit | null;
  onOpenEditHabitForm: () => void;
  onOpenDeleteHabitForm: () => void;
  fetchHabits: () => void;
  handleCompletionUpdate: (habit: Habit, newCount: number) => void;
}

const DataVisualSection: React.FC<DataVisualSectionProps> = ({ habit, onOpenEditHabitForm, onOpenDeleteHabitForm, fetchHabits, handleCompletionUpdate }) => {
  const [updatedHabit, setUpdatedHabit] = useState(habit);

  useEffect(() => {
    if (habit) {
      setUpdatedHabit(habit);  // Sync the updated habit
    }
  }, [habit]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formattedDate = today.toISOString();

  // Find today's occurrence or use a fallback
  const todaysOccurrence = updatedHabit?.occurrences.find(occ => new Date(occ.date).toDateString() === today.toDateString()) || {
    date: formattedDate,
    completions: 0
  };

  const recalculateHeatmapData = (occurrences: Occurrence[]) => {
    const occurrenceMap: { [key: string]: number } = {};
    occurrences.forEach(occ => {
      const dateKey = new Date(occ.date).toISOString().split('T')[0];
      occurrenceMap[dateKey] = occ.completions;
    });

    const heatmapData = updatedHabit?.heatmapData.map(data => {
      const dateKey = new Date(data.date).toISOString().split('T')[0];
      return {
        date: dateKey,
        completions: occurrenceMap[dateKey] || 0
      };
    });

    return heatmapData;
  };

  const handleLocalCompletionUpdate = (habit, newCount: number) => {
    const updatedOccurrences = updatedHabit?.occurrences.map(occ =>
      new Date(occ.date).toDateString() === today.toDateString() ? { ...occ, completions: newCount } : occ
    );
    const updatedHeatmapData = recalculateHeatmapData(updatedOccurrences || []);
    setUpdatedHabit({
      ...updatedHabit,
      occurrences: updatedOccurrences,
      heatmapData: updatedHeatmapData
    });
  };

  return (
    <div className={`habit-data h-[200px] shadow-md border border-[5px] border-[#C0D470] relative bg-[#E9D0A6]`}>
      <div className="habit-name col-span-12 md:col-span-3 flex flex-col justify-center text-[30px]">
        <div className="py-4 h-full flex flex-col justify-around">
          <p className="text-[40px]">{updatedHabit?.name}</p>
          <p className="text-[20px]">streak: {updatedHabit?.streak}🔥</p>

          <div className="text-[20px] pointer-cursor">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  consistency goal 🛈: {updatedHabit?.consistencyGoals.goal} / {updatedHabit?.habitPeriod}
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
        <HabitHeatmap data={updatedHabit?.heatmapData} />
      </div>

      <div className="habit-bar-graph col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitBarGraph occurrences={updatedHabit?.occurrences} consistencyGoals={[updatedHabit?.consistencyGoals]} habitPeriod={updatedHabit?.habitPeriod} />
      </div>
      {/* New Increment Area Div */}
      <div className="habit-increment-area col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitIncrement
          habitId={updatedHabit?._id}
          initialCount={todaysOccurrence.completions}
          onUpdateCompletion={(newCount) => {
            handleCompletionUpdate(updatedHabit, newCount);
            handleLocalCompletionUpdate(updatedHabit, newCount);
          }}
        />
      </div>
      <div className="corner-borders"></div>
      <div className="absolute top-0 right-4 flex space-x-2 z-20">
        <button onClick={onOpenEditHabitForm}>
          <Bolt size={24} strokeWidth={2} />
        </button>
        <button
          className='text-[#EB5757] text-[30px] hover:text-[#F2994A] cursor-pointer'
          onClick={onOpenDeleteHabitForm}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default DataVisualSection;
