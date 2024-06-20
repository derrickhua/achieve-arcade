import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './reward.css'

interface RewardPopupProps {
  reward: {
    name?: string;
    icon?: string;
    chestType?: string;
    user?: string;
  };
  chestType: string;
  onClose: () => void;
}

const RewardPopup: React.FC<RewardPopupProps> = ({ reward, chestType, onClose }) => {
  const [showFinalImage, setShowFinalImage] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const chestImages = {
    Wood: '/icons/shop/wood.png',
    Metal: '/icons/shop/metal.png',
    Gold: '/icons/shop/gold.png',
  };

  const chestGifs = {
    Wood: '/icons/shop/wood-opening.gif',
    Metal: '/icons/shop/metal-opening.gif',
    Gold: '/icons/shop/gold-opening.gif',
  };

  const chestOpened = {
    Wood: '/icons/shop/wood-open.png',
    Metal: '/icons/shop/metal-open.png',
    Gold: '/icons/shop/gold-open.png',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpenChest();
    }, 500); // Wait for 1 second before starting the opening sequence

    return () => clearTimeout(timer);
  }, []);

  const handleOpenChest = () => {
    const audio = new Audio('/sounds/shop/chest-open.mp3');
    audio.play();
    setIsOpened(true);
    setTimeout(() => {
      setShowWhiteScreen(true);
      setTimeout(() => {
        setShowWhiteScreen(false);
        setShowFinalImage(true);
      }, 700); // Duration of the white screen
    }, 1050); // Duration of the chest opening animation
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] py-[50px] rounded-xl p-8 relative  
      w-[30vw] h-[30vw] max-w-[600px] max-h-[600px] transition-opacity duration-500 ease-in-out" 
      style={{ opacity: showWhiteScreen ? 0 : 1 }}
      onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        {showFinalImage && (
          <>
            <h2 className="text-[40px] text-center text-[#F2C94C] mb-4">AMAZING! YOU RECEIVED</h2>
            <div className="mt-[3.5rem] text-center text-[40px] flex w-full justify-center ">
                <p className='gradient-text'>{`${reward.name}` || 'Absolutely Nothing!'}</p>
                <p className='inline-block'>{reward.icon || ''}</p>
            </div>
          </>
        )}
        <div className={`relative flex justify-center mb-4 ${showFinalImage ? 'h-[220px]' : 'h-[320px]'}`}>
          {isOpened ? (
            showFinalImage ? (
              <Image
                src={chestOpened[chestType]}
                alt={`${chestType} Chest`}
                width={400}
                height={400}
                className='absolute left-[130px] bottom-[30px]'
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <Image
                src={chestGifs[chestType]}
                alt={`${chestType} Chest Opening`}
                width={400}
                height={400}
                className='absolute left-[130px] bottom-[30px]'
                style={{ imageRendering: 'pixelated' }}
              />
            )
          ) : (
            <Image
              src={chestImages[chestType]}
              alt={`${chestType} Chest`}
              width={400}
              height={400}
              className='absolute left-[130px] bottom-[30px]'
              style={{ imageRendering: 'pixelated' }}
            />
          )}

          {showWhiteScreen && (
            <div className="absolute inset-0 bg-white z-50 transition-opacity duration-700 opacity-75"></div>
          )}
        </div>
        <div className="flex justify-center">
          {showFinalImage ? (
            <button
              className="bg-[#F2C94C] text-white text-[20px] px-4 py-2 border-[2px] border-[#F2C94C]
              rounded-lg hover:bg-white hover:text-[#F2C94C]"
              onClick={onClose}
            >
              COLLECT
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RewardPopup;