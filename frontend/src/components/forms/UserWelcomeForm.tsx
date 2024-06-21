import React, { useState } from 'react';
import Image from 'next/image';
import { updateUser } from '@/lib/user';

const UserWelcomeForm = ({ onClose }) => {
  const [workHours, setWorkHours] = useState(0);
  const [familyHours, setFamilyHours] = useState(0);
  const [leisureHours, setLeisureHours] = useState(0);
  const [atelicHours, setAtelicHours] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSavePreferences = async () => {
    if (!workHours || !familyHours || !leisureHours || !atelicHours || 
        parseInt(workHours, 10) <= 0 || parseInt(familyHours, 10) <= 0 ||
        parseInt(leisureHours, 10) <= 0 || parseInt(atelicHours, 10) <= 0) {
      setErrorMessage('All fields must be greater than 0');
      return;
    }

    const preferences = {
      workHoursPerWeek: parseInt(workHours, 10),
      familyFriendsHoursPerWeek: parseInt(familyHours, 10),
      leisureHoursPerWeek: parseInt(leisureHours, 10),
      atelicHoursPerWeek: parseInt(atelicHours, 10),
    };

    try {
      await updateUser({ preferences });
      onClose();
    } catch (error) {
      setErrorMessage('Failed to save preferences. Please try again.');
      console.error('Error updating user preferences:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[400px] md:w-[600px]">
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] text-center leading-none mb-4">WELCOME TO <br/> ACHIEVE ARCADE</h2>
        <div className='flex w-full gap-4 '>
            <Image src="/logo/logo.png" width={154} height={216} alt="arcade" />
            <div className='w-full'>
                <p className="text-[30px] leading-none mb-4">I&apos;m excited to have you here!</p>
                <p className="text-[25px]  mb-4">Before you get started, please tell me how many hours a week you&apos;ll dedicate to each activity category.</p>
            </div>
        </div>
        <div className="flex flex-wrap justify-between mb-4 mt-4">
        <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-[15px] md:text-[20px] mb-2 h-6">WORK</label>
            <p className="text-[12px] md:text-[14px] mb-1 h-10">Time spent on professional or work-related tasks.</p>
            <input
            className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
            type="number"
            id="workHours"
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
            min="1"
            required
            />
        </div>
        <div className="w-full md:w-1/2 px-2">
            <label className="block text-[15px] md:text-[20px] mb-2 h-6">FRIENDS & FAMILY</label>
            <p className="text-[12px] md:text-[14px] mb-1 h-10">Time spent with friends and family.</p>
            <input
            className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
            type="number"
            id="familyHours"
            value={familyHours}
            onChange={(e) => setFamilyHours(e.target.value)}
            min="1"
            required
            />
        </div>
        </div>

        <div className="flex flex-wrap justify-between mb-4">
        <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-[15px] md:text-[20px] mb-2 h-6">LEISURE</label>
            <p className="text-[12px] md:text-[14px] mb-1 h-10">Hobbies, relaxation, and entertainment.</p>
            <input
            className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
            type="number"
            id="leisureHours"
            value={leisureHours}
            onChange={(e) => setLeisureHours(e.target.value)}
            min="1"
            required
            />
        </div>
        <div className="w-full md:w-1/2 px-2">
            <label className="block text-[15px] md:text-[20px] mb-2 h-6">ATELIC</label>
            <p className="text-[12px] md:text-[14px] mb-1 h-10">Activities done for the sake of doing them.</p>
            <input
            className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
            type="number"
            id="atelicHours"
            value={atelicHours}
            onChange={(e) => setAtelicHours(e.target.value)}
            min="1"
            required
            />
        </div>
        </div>


        {errorMessage && (
          <div className="text-red-500 text-[15px] mb-4 w-full flex justify-center">{errorMessage}</div>
        )}

        <button
          onClick={handleSavePreferences}
          className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[16px] md:text-[20px]"
        >
          SAVE PREFERENCES
        </button>
      </div>
    </div>
  );
};

export default UserWelcomeForm;
