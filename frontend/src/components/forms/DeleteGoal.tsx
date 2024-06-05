import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteGoal, getAllGoals, Goal } from '@/lib/goals';

interface DeleteGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchGoals: () => Promise<void>;
  goal: Goal; // The goal to delete
}

const DeleteGoalForm: React.FC<DeleteGoalFormProps> = ({ isOpen, onClose, fetchGoals, goal }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleDelete = async () => {
    try {
      await deleteGoal(goal._id);
      await fetchGoals();
      setShowAlert(true);
      setAlertMessage('Goal deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      setShowAlert(true);
      setAlertMessage('Error deleting goal. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <span className='flex items-center mb-2'>
            <h2 className="text-[40px] text-[#EB5757] mr-2">DELETE GOAL: </h2>
            <p className='text-[30px]'>{goal.title}</p>
        </span>
        <p className="text-black mb-6 text-[20px]">Are you sure you want to delete this goal?</p>


        {showAlert && (
          <Alert variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
            <AlertTitle>{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 text-[20px]"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-[#EB5757] text-white px-4 py-2 rounded-lg hover:bg-red-700 text-[20px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalForm;
