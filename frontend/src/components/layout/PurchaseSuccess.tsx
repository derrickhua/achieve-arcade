import React from 'react';
import Image from 'next/image';

interface PurchaseSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-none rounded-2xl relative w-[1000px] h-[530px] mb-[200px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white text-xl z-20" onClick={onClose}>
          X
        </button>
        <Image src={'/icons/purchase/purchasedpro.png'} alt="Purchase Success" width={1000} height={530} style={{ imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
};

export default PurchaseSuccess;
