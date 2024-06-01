'use client';
import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getHabits, addHabit, deleteHabit } from '@/lib/habit';
import HabitCard from '@/components/habit/HabitCard';
import HabitDataVisualizer from '@/components/habit/HabitDataVisualizer';

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

interface AddHabitFormProps {
  fetchHabits: () => Promise<void>;
}

export default function HabitDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
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
      if (response.data.length > 0) {
        setSelectedHabit(response.data[0]);
      }
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch habits.');
      setIsLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      setHabits(habits.filter(habit => habit._id !== habitId));
    } catch (error) {
      setError('Failed to delete the habit.');
    }
  };

  const handleMaximizeHabit = (habit: Habit) => {
    setSelectedHabit(habit);
  };

  return (
    <div className="h-full flex flex-col">
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
            <AddHabitForm fetchHabits={fetchHabits} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="habit-dashboard max-h-[1000px]">
        {selectedHabit && (
          <div className="mb-4 flex justify-center relative rounded">
            <div className="animated-border h-[100%]">
              <HabitDataVisualizer habit={selectedHabit} />
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-4 justify-center habit-card-container">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <div key={habit._id} className="relative">
                {selectedHabit?._id === habit._id ? (
                  <div className="animated-border">
                    <HabitCard habit={habit} deleteHabit={handleDeleteHabit} maximizeHabit={handleMaximizeHabit} />
                  </div>
                ) : (
                  <HabitCard habit={habit} deleteHabit={handleDeleteHabit} maximizeHabit={handleMaximizeHabit} />
                )}
              </div>
            ))
          ) : (
            <p className="w-full text-center">No habits added yet. Start by adding a new habit!</p>
          )}
        </div>
      </div>
    </div>
  );
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ fetchHabits }) => {
  const [name, setName] = useState('');
  const [habitPeriod, setHabitPeriod] = useState('Daily');
  const [consistencyGoal, setConsistencyGoal] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const habitData = {
      name,
      habitPeriod,
      goal: consistencyGoal,
      effectiveDate: new Date().toISOString() // setting the effective date to today
    };

    try {
      const response = await addHabit(habitData);
      if (response.status === 201) {
        await fetchHabits();
        setName('');
        setHabitPeriod('Daily');
        setConsistencyGoal(1);
        setShowAlert(false);
      }
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
