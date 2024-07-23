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
import { useMediaQuery } from 'react-responsive';

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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (habit) {
      console.log('Habit updated:', habit); // Log habit updates
      setUpdatedHabit(habit);  // Sync the updated habit
    }
  }, [habit]);

  // Get the user's local date and normalize it to UTC for consistent comparison
  const localNow = new Date();
  const utcNow = new Date(Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()));
  const formattedDate = utcNow.toISOString().split('T')[0];

  console.log('User\'s local date (today):', utcNow); // Log the user's local date
  
  // Find today's occurrence or use a fallback
  const todaysOccurrence = updatedHabit?.occurrences.find(occ => {
    const occurrenceDate = new Date(occ.date);
    console.log('Checking occurrence date:', occurrenceDate.toISOString(), 'against today:', utcNow.toISOString());
    return occurrenceDate.getTime() === utcNow.getTime();
  }) || {
    date: formattedDate,
    completions: 0
  };
  
  console.log('Today\'s date:', utcNow.toDateString());
  console.log('Today\'s occurrence:', todaysOccurrence);

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

    console.log('Recalculated heatmap data:', heatmapData); // Log heatmap data
    return heatmapData;
  };

  const handleLocalCompletionUpdate = (habit, newCount: number) => {
    console.log('Updating local completion for date:', utcNow.toISOString());
    const updatedOccurrences = updatedHabit?.occurrences.map(occ => {
      const occurrenceDate = new Date(occ.date);
      console.log('Updating occurrence date:', occurrenceDate.toISOString(), 'with new count:', newCount);
      return occurrenceDate.getTime() === utcNow.getTime() ? { ...occ, completions: newCount } : occ;
    }) || [];
    const updatedHeatmapData = recalculateHeatmapData(updatedOccurrences);
    setUpdatedHabit({
      ...updatedHabit,
      occurrences: updatedOccurrences,
      heatmapData: updatedHeatmapData
    });

    console.log('Updated occurrences:', updatedOccurrences);
  };

  return (
    <div className={`habit-data ${isMobile ? '' : 'h-[200px]'} shadow-md border border-[5px] border-[#C0D470] relative bg-[#E9D0A6]`}>
      <div className="habit-name col-span-12 md:col-span-3 flex flex-col justify-center text-[30px]">
        <div className="px-1 md:px-0 py-4 h-full flex flex-col justify-around">
          <p className="text-[25px] md:text-[40px]">{updatedHabit?.name}</p>
          <p className="text-[15px] md:text-[20px]">streak: {updatedHabit?.streak}🔥</p>

          <div className="text-[15px] md:text-[20px] pointer-cursor text-left">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="p-0 m-0 w-full text-left leading-none">
                  consistency goal 🛈: &nbsp;{isMobile && <br />}{updatedHabit?.consistencyGoals.goal} / {updatedHabit?.habitPeriod}
                </TooltipTrigger>
                <TooltipContent>
                  <p>The total number of habits that should be completed within the habit period.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      {!isMobile && (
        <div className="habit-heatmap col-span-12 md:col-span-3 flex justify-center items-center">
          <HabitHeatmap data={updatedHabit?.heatmapData} />
        </div>
      )}

      {!isMobile && (
        <div className="habit-bar-graph col-span-12 md:col-span-2 flex justify-center items-center">
          <HabitBarGraph occurrences={updatedHabit?.occurrences} consistencyGoals={[updatedHabit?.consistencyGoals]} habitPeriod={updatedHabit?.habitPeriod} />
        </div>
      )}
      <div className="habit-increment-area col-span-12 md:col-span-2 flex justify-center items-center">
        <HabitIncrement
          habitId={updatedHabit?._id}
          initialCount={todaysOccurrence.completions}
          onUpdateCompletion={(habitId, newCount) => {
            handleCompletionUpdate(updatedHabit, newCount);
            handleLocalCompletionUpdate(updatedHabit, newCount);
          }}
        />
      </div>
      <div className="corner-borders"></div>
      <div className="absolute top-0 right-3 flex space-x-2 z-20">
        <button onClick={onOpenEditHabitForm}>
          <Bolt size={isMobile ? 20 : 24} strokeWidth={2} />
        </button>
        <button
          className="text-[#EB5757] text-[25px] md:text-[30px] hover:text-[#F2994A] cursor-pointer"
          onClick={onOpenDeleteHabitForm}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default DataVisualSection;
