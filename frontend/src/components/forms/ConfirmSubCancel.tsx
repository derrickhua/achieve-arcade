import React, { useState } from 'react';
import { cancelSubscription } from '@/lib/stripe';

interface ConfirmSubscriptionCancelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmSubscriptionCancelForm: React.FC<ConfirmSubscriptionCancelFormProps> = ({ isOpen, onClose, onConfirm }) => {
  const [lastSubscriptionDate, setLastSubscriptionDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      const response = await cancelSubscription();
      setLastSubscriptionDate(new Date(response.lastSubscriptionDate));
      onConfirm();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto" onClick={onClose}>
        <div className="bg-[#FEFDF2] rounded-xl p-4 md:p-8 relative w-[90vw] max-w-[700px] max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[20px] md:text-[30px] mb-4 text-[#EB5757]">Confirm Cancellation</h2>
        <p className="text-[16px] md:text-[20px] leading-8">By confirming, the following will happen:</p>

        <ul className="list-disc list-inside text-[14px] md:text-[20px] leading-8 mb-8">
          <li>Your last subscription payment will be refunded.</li>
          <li>Excess goals, habits, and tasks will be deleted to match the free plan&apos;s limit.</li>
        </ul>
        <div className="w-full space-x-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 text-[14px] md:text-[20px]"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            className="bg-[#EB5757] text-white px-4 py-2 rounded-lg hover:bg-red-700 text-[14px] md:text-[20px]"
          >
            CONFIRM
          </button>
        </div>
        {/* {lastSubscriptionDate && (
          <p className="text-[15px] md:text-[20px] mt-4">
            Your subscription will end on {lastSubscriptionDate.toDateString()}.
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ConfirmSubscriptionCancelForm;
