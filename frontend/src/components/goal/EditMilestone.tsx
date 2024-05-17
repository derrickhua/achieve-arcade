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
import { Textarea } from "@/components/ui/textarea"
import { updateMilestone, Milestone } from '@/lib/goals';

interface EditMilestoneProps {
    milestoneId: string;
    goalId: string;
    updateLocalMilestone: (milestone: any) => void;
    initialData: any;  // Assuming this is the structure received from the parent component
    setEditState: (state: boolean) => void;
}

export const EditMilestone = ({ milestoneId, goalId, updateLocalMilestone, initialData, setEditState }: EditMilestoneProps) => {
    const [title, setTitle] = useState(initialData.title);
    const [description, setDescription] = useState(initialData.description);
    const [deadline, setDeadline] = useState(initialData.deadline);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const handleSubmit = async (event:any) => {
        event.preventDefault();

        const milestoneData = {
            _id: milestoneId,
            title: title.trim() ? title : undefined,  // Only send title if it's not empty
            description: description.trim() ? description : undefined,  // Only send description if it's not empty
            deadline: deadline || undefined,  // Only send deadline if it's set
        };
    
        try {
            await updateMilestone(goalId, milestoneId, milestoneData);
            updateLocalMilestone(milestoneData); // Update local state in parent component
            setShowAlert(true);
            setAlertMessage('Milestone updated successfully!');
            setEditState(false);  
        } catch (error) {
            console.error('Failed to update milestone:', error);
            setShowAlert(true);
            setAlertMessage('Error updating milestone. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            <Label htmlFor="title">Milestone Title</Label>
            <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={initialData.title}  // Using the initialData for placeholder
            />
            <Label htmlFor="description">Description</Label>
            <Textarea 
                placeholder={initialData.description}  // Using the initialData for placeholder
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                id="description"
            />
            <Label htmlFor="deadline">Deadline</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button>
                        {deadline ? new Date(deadline).toLocaleDateString() : 'Select Deadline'}
                        <CalendarDays className="ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                        mode="single"
                        selected={deadline ? new Date(deadline) : undefined}
                        onSelect={(date) => date && setDeadline(date)}
                    />
                </PopoverContent>
            </Popover>
            <Button type="submit">Edit Milestone</Button>
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
