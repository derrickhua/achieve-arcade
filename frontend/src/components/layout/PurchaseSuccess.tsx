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
      <div
        className="relative w-full max-w-[90%] md:max-w-[1000px] h-auto md:h-[530px] mb-[10%] md:mb-[200px] bg-none rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-white text-xl z-20" onClick={onClose}>
          X
        </button>
        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src={'/icons/purchase/purchasedpro.png'}
            alt="Purchase Success"
            layout="responsive"
            width={1000}
            height={530}
            style={{ imageRendering: 'pixelated' }}
            className="rounded-2xl"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src={'/icons/purchase/mobile_purchase_success.png'}
            alt="Purchase Success"
            layout="responsive"
            width={1000}
            height={530}
            style={{ imageRendering: 'pixelated' }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
