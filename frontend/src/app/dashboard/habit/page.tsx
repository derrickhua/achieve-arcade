'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label" 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getHabits, addHabit, updateHabit, deleteHabit, completeHabit } from '@/lib/habit';
import HabitCard from '@/components/habit/HabitCard';

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

export default function HabitDashboard() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await getHabits();
      setHabits(response.data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch habits.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Habits</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Habit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
              <DialogDescription>Enter details about your new habit.</DialogDescription>
            </DialogHeader>
            <AddHabitForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex w-full gap-4 p-4 justify-center habits-container">
        {habits.length > 0 ? (
          habits.map((habit, index) => (
            <HabitCard key={index} habit={habit} />
          ))
        ) : (
          <p>No habits added yet. Start by adding a new habit!</p>
        )}
      </div>
    </div>
  );
}

function AddHabitForm() {
  const [name, setName] = useState('');
  const [habitPeriod, setHabitPeriod] = useState('Daily');
  const [consistencyGoal, setConsistencyGoal] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const effectiveDate = new Date(); // Set effective date to today
    effectiveDate.setHours(0, 0, 0, 0); // Normalize the time to midnight

    try {
      const habitData = {
        name,
        habitPeriod,
        goal: consistencyGoal,
        effectiveDate
      };
      const response = await addHabit(habitData);
      await getHabits();  // Refresh the habits list
      setName('');
      setHabitPeriod('Daily');
      setConsistencyGoal(1);
      setShowAlert(false);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage('Error adding habit. Please try again.')
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Habit Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          required
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="habitPeriod">Habit Period</Label>
        <p className='text-sm text-muted-foreground'>Time frame in which you aim to complete a habit</p>
        <Select onValueChange={setHabitPeriod} value={habitPeriod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="consistencyGoal">Consistency Goal</Label>
        <p className='text-sm text-muted-foreground'>The number of times you aim to do the habit within the chosen habit period</p>
        <Input
          id="consistencyGoal"
          type="number"
          value={consistencyGoal}
          onChange={(e) => setConsistencyGoal(Number(e.target.value))}
          min="1"
          required
        />
      </div>
      <Button type="submit" className='self-end'>Add Habit</Button>
      {showAlert && (
        <Alert variant='destructive'>
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}