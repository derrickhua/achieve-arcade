import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteTimeBlock } from '@/lib/dailySchedule';

interface Task {
  name: string;
  completed: boolean;
}

interface TimeBlock {
  _id: string;
  name: string;
  category: 'work' | 'leisure' | 'family_friends' | 'atelic';
  startTime: string | Date;
  endTime: string | Date;
  tasks: Task[];
  completed: boolean;
}

interface DeleteTimeBlockFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchSchedule: () => Promise<void>;
  timeBlock: TimeBlock;
}

const DeleteTimeBlockForm: React.FC<DeleteTimeBlockFormProps> = ({ isOpen, onClose, fetchSchedule, timeBlock }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleDelete = async () => {
    try {
      await deleteTimeBlock(timeBlock._id);
      await fetchSchedule();
      setShowAlert(true);
      setAlertMessage('Time block deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to delete time block:', error);
      setShowAlert(true);
      setAlertMessage('Error deleting time block. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-4 md:p-8 relative w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <span className='flex items-center mb-2'>
          <h2 className="text-[18px] md:text-[30px] text-[#EB5757] mr-2 font-[YOUR_FONT]">DELETE TIME BLOCK:</h2>
          <p className='text-[18px] md:text-[30px] font-[YOUR_FONT]'>{timeBlock.name}</p>
        </span>
        <p className="text-black md:mb-6 text-[16px] md:text-[20px] font-[YOUR_FONT]">Are you sure you want to delete this time block?</p>

        {showAlert && (
          <Alert variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
            <AlertTitle className="text-[16px] md:text-[20px] font-[YOUR_FONT]">{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
            <AlertDescription className="text-[14px] md:text-[16px] font-[YOUR_FONT]">
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2 md:space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-black px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-gray-300 text-[16px] md:text-[20px] font-[YOUR_FONT]"
          >
            CANCEL
          </button>
          <button
            onClick={handleDelete}
            className="bg-[#EB5757] text-white px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-red-700 text-[16px] md:text-[20px] font-[YOUR_FONT]"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTimeBlockForm;
