import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface PurchasePopUpProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const PurchasePopUp: React.FC<PurchasePopUpProps> = ({ isOpen, onClose, userId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      const hiddenInput = formRef.current.querySelector('input[name="userId"]');
      if (hiddenInput) {
        hiddenInput.value = userId;
      }
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative w-full max-w-lg md:max-w-2xl h-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white text-xl" onClick={onClose}>
          X
        </button>
        <div className="relative w-full h-0 pb-[116.85%] md:pb-[117.5%]">
          <Image src={'/icons/purchase/purchased-card.png'} alt="Purchase Card" 
          layout="fill" objectFit="contain" style={{ imageRendering: 'pixelated' }} 
          onContextMenu={(e) => e.preventDefault()}/>
        </div>
        <form ref={formRef} action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/create-checkout-session`} method="POST">
          <input type="hidden" name="userId" value={userId} />
          <button type="submit" className="absolute bottom-[6%] left-1/2 transform -translate-x-1/2 bg-[#FFA501] border border-white text-white px-4 rounded-lg hover:bg-white hover:text-[#FFA501] text-[20px] md:text-[50px] w-[80%] md:w-[550px] h-[50px] md:h-[70px]">
            PURCHASE
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchasePopUp;
