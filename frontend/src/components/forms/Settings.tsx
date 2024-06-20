import React, { useEffect, useState } from 'react';
import { getUser, updateUser } from '@/lib/user';
import ConfirmSubscriptionCancelForm from './ConfirmSubCancel';
import PurchaseCancel from '../layout/PurchaseCancel';

interface SettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  fetchUser: () => void;
  user: any; // Add user data prop
}

const SettingsForm: React.FC<SettingsFormProps> = ({ isOpen, onClose, isPro, fetchUser, user }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      workHoursPerWeek: '',
      leisureHoursPerWeek: '',
      familyFriendsHoursPerWeek: '',
      atelicHoursPerWeek: '',
    },
  });
  
  useEffect(() => {
    if (isOpen && user) {
      setUserData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        preferences: {
          workHoursPerWeek: user.preferences.workHoursPerWeek || '',
          leisureHoursPerWeek: user.preferences.leisureHoursPerWeek || '',
          familyFriendsHoursPerWeek: user.preferences.familyFriendsHoursPerWeek || '',
          atelicHoursPerWeek: user.preferences.atelicHoursPerWeek || '',
        },
      });
    }
  }, [isOpen, user]);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [purchaseCancel, setPurchaseCancel] = useState(false);

  const fetchUserData = async () => {
    try {
      const data = await getUser();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');

    const { workHoursPerWeek, leisureHoursPerWeek, familyFriendsHoursPerWeek, atelicHoursPerWeek } = userData.preferences;
    if (
      !workHoursPerWeek || parseInt(workHoursPerWeek) <= 0 ||
      !leisureHoursPerWeek || parseInt(leisureHoursPerWeek) <= 0 ||
      !familyFriendsHoursPerWeek || parseInt(familyFriendsHoursPerWeek) <= 0 ||
      !atelicHoursPerWeek || parseInt(atelicHoursPerWeek) <= 0
    ) {
      setIsError(true);
      setMessage("All preference values must be greater than 0");
      console.log('Setting message: All preference values must be greater than 0');
      return;
    }

    if (userData.password && userData.password !== userData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      console.log('Setting message: Passwords do not match');
      return;
    }

    try {
      const response = await updateUser(userData);
      setIsError(false); // Set isError to false on success
      setMessage(response.message);
      console.log('Setting message:', response.message);
    } catch (error) {
      setIsError(true);
      setMessage('Error updating user data');
      console.log('Setting message: Error updating user data');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
          <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
              X
            </button>
            <h2 className="text-[40px]">Update Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black text-[25px] mb-2" htmlFor="username">Username</label>
                <input
                  className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username || ''}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black text-[25px] mb-2" htmlFor="email">Email</label>
                <input
                  className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email || ''}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black text-[25px] mb-2" htmlFor="password">Password</label>
                <input
                  className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password || ''}
                  onChange={handleInputChange}
                  placeholder="New Password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black text-[25px] mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData.confirmPassword || ''}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                />
              </div>
              <h3 className="text-black text-[25px] mb-2">Hours Per Week</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-black text-[20px] mb-2" htmlFor="workHoursPerWeek">Work</label>
                  <input
                    className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                    type="number"
                    id="workHoursPerWeek"
                    name="workHoursPerWeek"
                    value={userData.preferences.workHoursPerWeek || ''}
                    onChange={handlePreferencesChange}
                    min="1"
                    placeholder="Work Hours"
                  />
                </div>
                <div>
                  <label className="block text-black text-[20px] mb-2" htmlFor="leisureHoursPerWeek">Leisure</label>
                  <input
                    className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                    type="number"
                    id="leisureHoursPerWeek"
                    name="leisureHoursPerWeek"
                    value={userData.preferences.leisureHoursPerWeek || ''}
                    onChange={handlePreferencesChange}
                    min="1"
                    placeholder="Leisure Hours"
                  />
                </div>
                <div>
                  <label className="block text-black text-[20px] mb-2" htmlFor="familyFriendsHoursPerWeek">Family & Friends</label>
                  <input
                    className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                    type="number"
                    id="familyFriendsHoursPerWeek"
                    name="familyFriendsHoursPerWeek"
                    value={userData.preferences.familyFriendsHoursPerWeek || ''}
                    onChange={handlePreferencesChange}
                    min="1"
                    placeholder="Family & Friends Hours"
                  />
                </div>
                <div>
                  <label className="block text-black text-[20px] mb-2" htmlFor="atelicHoursPerWeek">Atelic</label>
                  <input
                    className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
                    type="number"
                    id="atelicHoursPerWeek"
                    name="atelicHoursPerWeek"
                    value={userData.preferences.atelicHoursPerWeek || ''}
                    onChange={handlePreferencesChange}
                    min="1"
                    placeholder="Atelic Hours"
                  />
                </div>
              </div>
              {message && (
                <div className={`mb-4 text-[20px] ${isError ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </div>
              )}

              <div className="flex justify-end w-full space-x-[20px] mt-8">
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
                  >
                  UPDATE
                </button>
              </div>
            </form>
                  {isPro && (
                    <div className="flex justify-end mt-4 ">
                      <button
                        onClick={() => setConfirmCancel(true)}
                        className="bg-[#EB5757] text-white px-6 py-2 rounded-lg border-2 border-[#EB5757] hover:bg-white hover:text-[#EB5757] text-[20px]"
                      >
                        CANCEL SUBSCRIPTION
                      </button>
                    </div>
                  )}
            <ConfirmSubscriptionCancelForm
              isOpen={confirmCancel}
              onClose={() => setConfirmCancel(false)}
              onConfirm={() => {
                setConfirmCancel(false);
                console.log('Confirmed subscription cancellation');
                setPurchaseCancel(true);
                fetchUser()
              }}
            />
            {purchaseCancel && <PurchaseCancel isOpen={purchaseCancel} onClose={() => setPurchaseCancel(false)} />}

          </div>
        </div>
      )}
    </>
  );
};

export default SettingsForm;
