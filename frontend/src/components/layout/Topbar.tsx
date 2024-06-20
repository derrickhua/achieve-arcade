import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Info, MailQuestion, Settings, LogOut } from 'lucide-react';
import SuggestionForm from '../forms/SuggestionForm'; // Adjust the path as needed
import SettingsForm from '../forms/Settings';
import LogoutConfirmationForm from '../forms/Logout';
import PurchasePopUp from './PurchasePopUp'; // Import the new form
import PurchaseSuccess from './PurchaseSuccess'; // Import the new success form
import UserWelcomeForm from '../forms/UserWelcomeForm'; // Import the UserWelcomeForm
import { getUser } from '@/lib/user';
import './layout.css';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  coins: number;
}

const Topbar: React.FC<TopbarProps> = ({ coins }) => {
  const [suggestions, setSuggestions] = useState(false);
  const [logout, setLogout] = useState(false);
  const [purchase, setPurchase] = useState(false); // New state for PurchaseForm
  const [purchaseSuccess, setPurchaseSuccess] = useState(false); // New state for PurchaseSuccess
  const [help, setHelp] = useState(false);
  const [settings, setSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const router = useRouter();

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      console.log('Fetched User:', userData);
      setUser(userData);

      // Check if the preferences object exists and if any of the hours are undefined or zero
      const { preferences } = userData;
      if (
        !preferences ||
        !preferences.workHoursPerWeek ||
        !preferences.leisureHoursPerWeek ||
        !preferences.familyFriendsHoursPerWeek ||
        !preferences.atelicHoursPerWeek
      ) {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true' && query.get('session_id')) {
      setPurchaseSuccess(true);
      // Clear the query parameters from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('session_id');
      router.replace(url.toString(), undefined, { shallow: true });
    }
  }, [router]);

  return (
    <div className="bg-black flex justify-between items-center h-[70px]">
      <div className="flex items-center">
        <div className='w-[100px] flex justify-center'>
          <Image src={'/icons/logo.png'} alt={`company logo icon`} width={40} height={40} quality={100}  style={{ imageRendering: 'pixelated' }} />
        </div>
        <p className='text-2xl text-[#FEFDF2] text-[50px] ml-4'>ACHIEVE ARCADE</p>
        {user?.subscription === 'pro' && (
          <p className='text-[30px] text-white pro-text ml-2 mt-2'>PRO</p>
        )}
      </div>
      <div className="flex items-center mr-4">
        {user && user.subscription !== 'pro' && (
          <button className='px-4 pro-button mr-4 text-[25px] rounded-md w-[150px] text-[#FEFDF2] tracking-[2px]' onClick={() => setPurchase(true)}>
            UPGRADE
          </button>
        )}
        <span className="flex items-center justify-end text-[#F2C94C] w-[100px] h-[30px] bg-[#FEFDF2] text-[20px] rounded-xl text-right px-3 space-x-1">
          <p className='mt-1'>{coins}</p>
          <Image src={'/icons/coin.png'} alt={`coin icon`} width={20} height={20} quality={100} />
        </span>
        <button className="p-2" onClick={() => setSuggestions(true)}>
          <MailQuestion size={32} strokeWidth={2} color="#FEFDF2"/>  
        </button>
        <button className="p-2" onClick={() => setSettings(true)}>
          <Settings size={32} strokeWidth={2} color="#FEFDF2"/>
        </button>
        <button className="p-2" onClick={() => setLogout(true)}>
          <LogOut size={32} strokeWidth={2} color="#FEFDF2"/>
        </button>
      </div>
      {suggestions && <SuggestionForm isOpen={suggestions} onClose={() => setSuggestions(false)} />}
      {settings && <SettingsForm isOpen={settings} onClose={() => setSettings(false)} isPro={user?.subscription === 'pro'} fetchUser={fetchUser} user={user}/>} {/* Pass isPro prop and fetchUser */}
      {logout && <LogoutConfirmationForm isOpen={logout} onClose={() => setLogout(false)} />}
      {purchase && user && <PurchasePopUp isOpen={purchase} onClose={() => setPurchase(false)} userId={user._id} />} {/* Pass user ID */}
      {purchaseSuccess && <PurchaseSuccess isOpen={purchaseSuccess} onClose={() => setPurchaseSuccess(false)} />} {/* Handle purchase success */}
      {showWelcome && <UserWelcomeForm isOpen={showWelcome} onClose={() => {
        setShowWelcome(false)
        fetchUser()
      }} />} {/* Render UserWelcomeForm */}
    </div>
  );
};

export default Topbar;
