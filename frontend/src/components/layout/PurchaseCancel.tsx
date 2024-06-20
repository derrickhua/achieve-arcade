import React from 'react';
import Image from 'next/image';

interface PurchaseCancelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseCancel: React.FC<PurchaseCancelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-none rounded-2xl relative w-[899px] h-[531px] mb-[200px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white text-xl" onClick={onClose}>
          X
        </button>
        <Image src={'/icons/purchase/purchase-cancel.png'} alt="Purchase Cancelled" width={899} height={531} style={{ imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
};

export default PurchaseCancel;
