import React from 'react';
import Image from 'next/image';
import { MailQuestion } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

const UserWelcomeForm = ({ onClose }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 sm:p-8">
      <div className="bg-[#FEFDF2] overflow-y-auto rounded-xl p-4 sm:p-6 relative w-full max-w-[400px] sm:max-w-[600px] max-h-[80vh]">
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[24px] sm:text-[32px] text-center leading-none mb-4">WELCOME TO <br/> ACHIEVE ARCADE</h2>
        <div className='flex flex-col items-center w-full gap-4'>
          <Image src="/logo/logo.png" width={isMobile ? 80 : 120} height={isMobile ? 100 : 168} alt="arcade" className="mx-auto" onContextMenu={(e) => e.preventDefault()} />
          <div className='w-full text-center'>
            <p className="text-[18px] sm:text-[24px] leading-none mb-4">I&apos;m excited to have you here!</p>
            <p className="text-[16px] sm:text-[20px] mb-4">If you have any questions, concerns, or feature requests, feel free to reach out</p>
            <div className="flex justify-center">
              <MailQuestion className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2} color="#000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWelcomeForm;
