import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Task {
  name: string;
  completed: boolean;
}

interface TimeBlock {
  _id: string;
  name: string;
  category: 'work' | 'leisure' | 'family_friends' | 'atelic';
  startTime: string;
  endTime: string;
  tasks: Task[];
  completed: boolean;
}

interface StartTimerDialogProps {
  block: TimeBlock;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

const categoryColors: { [key in TimeBlock['category']]: string } = {
  work: 'bg-[#3B82F6]',
  leisure: 'bg-[#EF4444]',
  family_friends: 'bg-[#98E4A5]',
  atelic: 'bg-[#F4CB7E]',
};

const StartTimerDialog: React.FC<StartTimerDialogProps> = ({ block, isOpen, onClose, onStart }) => {
  const colorClass = categoryColors[block.category] || 'bg-gray-500';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`dialog-content ${colorClass}`}>
        <DialogTitle className="dialog-title">Start Timer for {block.name}?</DialogTitle>
        <p>Do you want to start the timer for this time block?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2">
            Cancel
          </Button>
          <Button onClick={onStart} className="bg-blue-500 border border-white hover:bg-blue-600 text-white rounded px-4 py-2">
            Start Timer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartTimerDialog;
