import React from 'react';
import Image from 'next/image';

interface PurchaseCancelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseRefund: React.FC<PurchaseCancelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className="relative w-full max-w-[90%] md:max-w-[899px] h-auto md:h-[531px] mb-[10%] md:mb-[200px] bg-none rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-white text-xl" onClick={onClose}>
          X
        </button>
        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src={'/icons/purchase/purchase-cancel.png'}
            alt="Purchase Cancelled"
            layout="responsive"
            width={899}
            height={531}
            style={{ imageRendering: 'pixelated' }}
            className="rounded-2xl"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src={'/icons/purchase/mobile_refund.png'}
            alt="Purchase Cancelled"
            layout="responsive"
            width={899}
            height={531}
            style={{ imageRendering: 'pixelated' }}
            className="rounded-2xl"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseRefund;
