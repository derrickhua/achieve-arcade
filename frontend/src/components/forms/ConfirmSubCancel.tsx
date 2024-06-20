import React from 'react';
import { cancelSubscription } from '@/lib/stripe';

interface ConfirmSubscriptionCancelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmSubscriptionCancelForm: React.FC<ConfirmSubscriptionCancelFormProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    console.log('handleConfirm called');
    try {
      await cancelSubscription();
      onConfirm();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[700px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[30px] mb-4">Confirm Cancellation</h2>
        <p className="text-[20px] mb-8">Are you sure you want to cancel your subscription?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 text-[20px]"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            className="bg-[#EB5757] text-white px-4 py-2 rounded-lg hover:bg-red-700 text-[20px]"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubscriptionCancelForm;
