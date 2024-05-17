'use client';
import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateGoal, Goal, GoalUpdateData } from '@/lib/goals';

interface EditGoalProps {
    goalId: string;
    initialData: Goal;
    setGoalState: (state: boolean) => void;
    updateLocalGoal: (updatedGoal: Partial<Goal> & { _id: string }) => void;
}

export const EditGoal = ({ goalId, initialData, setGoalState, updateLocalGoal  }: EditGoalProps) => {
    const [title, setTitle] = useState(initialData.title);
    const [description, setDescription] = useState(initialData.description);
    const [reason, setReason] = useState(initialData.reason);
    const [deadline, setDeadline] = useState<Date | null>(initialData.deadline ? new Date(initialData.deadline) : null);
    const [priority, setPriority] = useState(initialData.priority);
    const [category, setCategory] = useState(initialData.category);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const categoryOptions = [
      "Health & Wellness", 
      "Career & Education", 
      "Finance", 
      "Personal Development",
      "Family & Relationships", 
      "Recreation & Leisure", 
      "Spirituality"
    ];

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const goalData: GoalUpdateData = {
            title: title.trim() ? title : undefined,
            description: description.trim() ? description : undefined,
            reason: reason.trim() ? reason : undefined,
            deadline: deadline || undefined,
            priority: priority || undefined,
            category: category.trim() ? category : undefined,
        };

        try {
            await updateGoal(goalId, goalData);
            updateLocalGoal({ _id: goalId, ...goalData }); // Call the function with partial updates
            setShowAlert(true);
            setAlertMessage('Goal updated successfully!');
            setGoalState(false);
        } catch (error) {
            console.error('Failed to update goal:', error);
            setShowAlert(true);
            setAlertMessage('Error updating goal. Please try again.');
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            <Label htmlFor="title">Goal Title</Label>
            <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={initialData.title}
            />
            <Label htmlFor="description">Description</Label>
            <Textarea 
                placeholder={initialData.description}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                id="description"
            />
            <Label htmlFor="reason">Reason</Label>
            <Textarea 
                placeholder={initialData.reason}
                onChange={(e) => setReason(e.target.value)}
                value={reason}
                id="reason"
            />
            <Label htmlFor="deadline">Deadline</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button>
                        {deadline ? deadline.toLocaleDateString() : 'Select Deadline'}
                        <CalendarDays className="ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                        mode="single"
                        selected={deadline || undefined}
                        onSelect={(date) => date && setDeadline(date)}
                    />
                </PopoverContent>
            </Popover>
            <Label htmlFor="priority">Priority</Label>
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
            <Label htmlFor="category">Category</Label>
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
            <Button type="submit">Edit Goal</Button>
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
