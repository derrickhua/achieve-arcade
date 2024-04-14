'use client'
import { useState } from 'react';
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
import { getHabits, addHabit, updateHabit, deleteHabit, completeHabit } from '@/lib/habit';
export default function HabitDashboard() {
  const [habits, setHabits] = useState([]);

  const handleAddHabit = (habit) => {
    setHabits([...habits, habit]);
  };

  return (
    <div className="p-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  const [frequency, setFrequency] = useState('Daily');
  const [consistencyGoal, setConsistencyGoal] = useState(1); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const habitData = { name, frequency, consistencyGoal };
      const response = await addHabit(habitData);
      console.log('Habit added:', response.data);
    } catch (error) {
      console.error('Error adding habit:', error.response ? error.response.data : error.message);
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
      <Label htmlFor="frequency">Habit Period</Label>
      <p className='text-sm text-muted-foreground'>Time frame in which you aim to complete a habit</p>
        <Select onValueChange={setFrequency}  value={frequency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Frequency" />
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
    </form>
  );
}


function HabitCard({ habit }) {
  return (
    <div className="border p-3 rounded">
      <h2 className="font-semibold">{habit.name}</h2>
      <p>Frequency: {habit.frequency}</p>
    </div>
  );
}
