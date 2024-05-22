'use client'
import React, { useState, useEffect } from 'react';
//UI Components and Aesthetic Imports
import { CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Utility Functions
import { getAllGoals, deleteGoal } from '@/lib/goals';
import { AddGoalForm } from '@/components/goal/AddGoalForm';
import GoalCard from '@/components/goal/GoalCard';
import { sampleGoal } from '@/components/goal/GoalSampleData';
interface AddGoalFormProps {
  fetchGoals: () => Promise<void>;
}

interface Goal {
  _id: string;
  title: string;
  progress: number;
  reason: string;
  completionRate: number;
  deadlineAdherence: boolean;
  goalVelocity: number;
}

export default function GoalDashboard() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      // Replace `getGoals` with your API call to fetch goals
      const response:any = await getAllGoals();
      console.log(response)
      setGoals(response);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch goals.');
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = (updatedGoal: Partial<Goal> & { _id: string }) => {
    setGoals(goals.map(goal => (goal._id === updatedGoal._id ? { ...goal, ...updatedGoal } : goal)));
};

  const handleDeleteGoal = async (goalId: string) => {
    try {
      // Replace `deleteGoal` with your API call to delete a goal
      await deleteGoal(goalId);
      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (error) {
      setError('Failed to delete the goal.');
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Goals</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>Enter details about your new goal.</DialogDescription>
            </DialogHeader>
            <AddGoalForm fetchGoals={fetchGoals}/>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4 justify-items-center goals-container">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
              <GoalCard key={index} goal={goal} onDelete={handleDeleteGoal} onUpdate={handleUpdateGoal}/>
          ))
        ) : 
          <p className="col-span-2 text-center">No goals added yet. Start by adding a new goal!</p> 
        }
      </div>
    </div>
  );
}
