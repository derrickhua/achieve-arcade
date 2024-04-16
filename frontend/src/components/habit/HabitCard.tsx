import { completeHabit } from "@/lib/habit";
import React from "react";
import { Heatmap } from "./HabitHeatMap";
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
  performanceRate: {
    consistencyRate: number;
    totalCompletions: number;
    totalPossibleCompletions: number;
  };
  heatmapData: Array<any>; // Specify more detailed types as needed
}

// Define the component using React.FC for functional component typing
const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => {
    console.log(habit)
  return (
    <div className="habit-card flex flex-row items-center justify-around p-4 bg-white border rounded-xl mb-4 w-[90%] max-h-[13vh]">
    <div className="habit-name w-[10%]">
      <p className="text-[25px]">{habit.name}</p>
    </div>
    <div className="habit-streak w-[10%] flex flex-col justify-center items-center">
      <p>STREAK</p>
      <p className="text-[25px]">{habit.streak}</p>
    </div>
    <div className="habit-heatmap w-[30%] justify-center items-center flex flex-col h-full ">
      <p>Past Month</p>
      <Heatmap data={habit.heatmapData} /> 
    </div>
    <div className="habit-bar-graph w-[30%]">
      <p>Bar Graph Placeholder</p>  {/* Placeholder for now */}
    </div>
    <div className="habit-performance w-[10%]">
      {/* <ProgressCircle progress={habit.performanceRate.consistencyRate} total={100} /> Commented out for now */}
    </div>
  </div>
  );
}

export default HabitCard;
