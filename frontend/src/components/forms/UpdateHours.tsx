import React, { useState } from 'react';
import { updateUser } from '@/lib/user';
import { useMediaQuery } from 'react-responsive';

const UpdateHoursForm = ({ isOpen, onClose, fetchSchedule }) => {
  const [workHours, setWorkHours] = useState(0);
  const [familyHours, setFamilyHours] = useState(0);
  const [leisureHours, setLeisureHours] = useState(0);
  const [atelicHours, setAtelicHours] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
      await fetchSchedule(); // Fetch the schedule again to reflect the updated preferences
      onClose();
    } catch (error) {
      setErrorMessage('Failed to save preferences. Please try again.');
      console.error('Error updating user preferences:', error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 sm:p-8">
        <div className="bg-[#FEFDF2] overflow-y-auto rounded-xl p-4 sm:p-6 relative w-full max-w-[400px] sm:max-w-[600px] h-auto max-h-[80vh]">
          <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
            X
          </button>
          <h2 className="text-[24px] sm:text-[32px] text-center leading-none mb-4">Update Your Weekly Hours</h2>
          <div className="flex flex-wrap justify-between mb-4">
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-[14px] sm:text-[18px] md:h-6">WORK</label>
              <p className="text-[12px] sm:text-[14px] mb-2 md:h-10">Time spent on professional or work-related tasks.</p>
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
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-[14px] sm:text-[18px]">FRIENDS & FAMILY</label>
              <p className="text-[12px] sm:text-[14px] mb-2 md:h-10">Time spent with friends and family.</p>
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
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-[14px] sm:text-[18px]">LEISURE</label>
              <p className="text-[12px] sm:text-[14px] mb-2 md:h-10">Hobbies, relaxation, and entertainment.</p>
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
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-[14px] sm:text-[18px]">ATELIC</label>
              <p className="text-[12px] sm:text-[14px] mb-2 md:h-10">Activities done for the sake of doing them.</p>
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
            <div className="text-red-500 text-[14px] mb-4 w-full flex justify-center">{errorMessage}</div>
          )}

          <button
            onClick={handleSavePreferences}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[14px] sm:text-[18px]"
          >
            SAVE PREFERENCES
          </button>
        </div>
      </div>
    )
  );
};

export default UpdateHoursForm;
