'use client'
import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Utility Functions
import { createGoal } from '@/lib/goals';

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

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ fetchGoals }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reason, setReason] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    
    // State for validation messages
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [reasonError, setReasonError] = useState('');
    const [deadlineError, setDeadlineError] = useState('');
  
    const categoryOptions = [
      "Health & Wellness", "Career & Education", "Finance", "Personal Development",
      "Family & Relationships", "Recreation & Leisure", "Spirituality"
    ];
  
    const validateForm = () => {
      let isValid = true;
      if (!title) {
        setTitleError('Goal title is required.');
        isValid = false;
      } else {
        setTitleError('');
      }
      if (!reason) {
        setReasonError('Reason for setting the goal is required.');
        isValid = false;
      } else {
        setReasonError('');
      }
      if (!deadline) {
        setDeadlineError('Deadline for the goal is required.');
        isValid = false;
      } else {
        setDeadlineError('');
      }
      return isValid;
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!validateForm()) {
        setShowAlert(true);
        setAlertMessage('Please fill in all required fields.');
        return;
      }
  
      const goalData = {
        title,
        description,
        reason,
        deadline: new Date(deadline).toISOString(),
        priority,
        category: category.length > 0 ? category : undefined,
      };
  
      try {
        const newGoal = await createGoal(goalData);
            await fetchGoals();
        setTitle('');
        setDescription('');
        setReason('');
        setDeadline('');
        setPriority('Medium');
        setCategory('');
        setShowAlert(true);
        setAlertMessage('Goal added successfully!');
      } catch (error) {
        console.error('Failed to create goal:', error);
        setShowAlert(true);
        setAlertMessage('Error adding goal. Please try again.');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
        <div className="grid w-full max-w-md gap-1.5">
          <Label htmlFor="title">Goal Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter goal title"
            required
          />
          {titleError && <p className="text-red-500 text-[13px]">{titleError}</p>}
          <Label htmlFor="description" className='mt-2'>Description</Label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal"
          />
          {descriptionError && <p className="text-red-500 text-[13px]">{descriptionError}</p>}
          <Label htmlFor="reason" className='mt-2'>Reason</Label>
          <Input
            id="reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you setting this goal?"
            required
          />
          {reasonError && <p className="text-red-500 text-[13px]">{reasonError}</p>}
          <Label htmlFor="deadline" className='mt-2'>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                {deadline ? deadline : 'Select Deadline'}
                <CalendarDays className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={deadline ? new Date(deadline) : undefined}
                onSelect={(date) => setDeadline(date.toISOString().split('T')[0])}
              />
            </PopoverContent>
          </Popover>
          {deadlineError && <p className="text-red-500 text-[13px]">{deadlineError}</p>}
          <Label htmlFor="priority" className='mt-2'>Priority</Label>
          <Select onValueChange={setPriority} value={priority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="categories" className='mt-2'>Category</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((categoryOption) => (
                <SelectItem key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add Goal</Button>
        {showAlert && (
          <Alert variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
            <AlertTitle>{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
            <AlertDescription>
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}
      </form>
    );
  };