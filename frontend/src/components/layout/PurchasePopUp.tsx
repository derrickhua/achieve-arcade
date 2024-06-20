import React from 'react';
import Image from 'next/image';

interface PurchasePopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchasePopUp: React.FC<PurchasePopUpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-none rounded-2xl p-8 relative w-[745px] h-[871px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white text-xl" onClick={onClose}>
          X
        </button>
        <Image src={'/icons/purchase/purchased-card.png'} alt="Purchase Card" layout="fill" objectFit="contain" style={{ imageRendering: 'pixelated' }} />
        <form action="http://localhost:8000/api/stripe/create-checkout-session" method="POST">
          <button type="submit" className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-[#FFA501] border border-white text-white px-4 rounded-lg hover:bg-white hover:text-[#FFA501] text-[50px] w-[550px] h-[70px]">
            PURCHASE
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchasePopUp;
