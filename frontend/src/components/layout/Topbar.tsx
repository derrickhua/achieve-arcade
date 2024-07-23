import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MailQuestion, Settings, LogOut } from 'lucide-react';
import SuggestionForm from '../forms/SuggestionForm';
import SettingsForm from '../forms/Settings';
import LogoutConfirmationForm from '../forms/Logout';
import PurchasePopUp from './PurchasePopUp';
import PurchaseSuccess from './PurchaseSuccess';
import { getUser } from '@/lib/user';
import { useRouter } from 'next/navigation';
import './layout.css';
import UserWelcomeForm from '../forms/UserWelcomeForm';
import { useMediaQuery } from 'react-responsive';
interface TopbarProps {
  coins: number;
}

const Topbar: React.FC<TopbarProps> = ({ coins }) => {
  const [suggestions, setSuggestions] = useState(false);
  const [logout, setLogout] = useState(false);
  const [purchase, setPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [settings, setSettings] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      console.log('user', userData);
      setUser(userData);

      const { preferences, createdAt } = userData;
      const userCreationTime = new Date(createdAt).getTime();
      const currentTime = Date.now();
      const timeDifference = currentTime - userCreationTime;

      if (
        !preferences ||
        !preferences.workHoursPerWeek ||
        !preferences.leisureHoursPerWeek ||
        !preferences.familyFriendsHoursPerWeek ||
        !preferences.atelicHoursPerWeek ||
        timeDifference <= 60 * 60 * 1000
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
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('session_id');
      router.replace(url.toString(), undefined, { shallow: true });
    }
  }, [router]);

  return (
    <div className="bg-black flex justify-between items-center h-[70px] p-2 md:px-4 w-full overflow-hidden">
      <div className="flex items-center">
        <div className="relative w-[40px] md:w-[50px] h-[40px] md:h-[50px] flex justify-center">
          <Image
            src={'/icons/logo.png'}
            alt={`company logo icon`}
            fill
            quality={100}
            unoptimized
            style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
          />
        </div>
        <div className="ml-1 md:ml-4 flex flex-col md:flex-row md:items-center md:space-x-2">
          <p className={`text-[16px] sm:text-[20px] md:text-[30px] lg:text-[40px] text-[#FEFDF2] leading-none ${user?.subscription === 'pro' ? 'pro-text' : ''}`}>ACHIEVE&nbsp;</p>
          <p className={`text-[16px] sm:text-[20px] md:text-[30px] lg:text-[40px] text-[#FEFDF2] leading-none ${user?.subscription === 'pro' ? 'pro-text' : ''}`}>ARCADE</p>
          {user?.subscription === 'pro' && (
            <p className='text-[16px] md:text-[30px] text-white pro-text ml-2 hidden md:block'>PRO</p>
          )}
        </div>
      </div>
      <div className="flex items-center mr-2 md:mr-4 space-x-1 md:space-x-0">
        {user && user.subscription !== 'pro' && (
          <button className='px-2 mr-1 md:mr-2 md:px-4 py-1 md:py-2 pro-button text-[#FEFDF2] text-[14px] md:text-[18px] rounded-md tracking-[0.5px] md:tracking-[1px]' onClick={() => setPurchase(true)}>
            UPGRADE
          </button>
        )}
        <span className="flex items-center justify-end text-[#F2C94C] w-[60px] md:w-[80px] h-[25px] md:h-[30px] bg-[#FEFDF2] text-[16px] md:text-[20px] rounded-lg text-right px-1 md:px-2 space-x-1">
          <p>{coins}</p>
          <Image src={'/icons/coin.png'} alt={`coin icon`} width={15} height={15} quality={100} unoptimized />
        </span>
        {!isMobile && 
          <button className="p-1 md:p-2 hidden md:block" onClick={() => setSuggestions(true)}>
            <MailQuestion className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} color="#FEFDF2" />
          </button>
        }
        <button className="mx-2 sm:p-1 md:p-2" onClick={() => setSettings(true)}>
          <Settings className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} color="#FEFDF2" />
        </button>
        <button className="sm:p-1 md:p-2" onClick={() => setLogout(true)}>
          <LogOut className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} color="#FEFDF2" />
        </button>
      </div>
      {suggestions && <SuggestionForm isOpen={suggestions} onClose={() => setSuggestions(false)} />}
      {settings && <SettingsForm isOpen={settings} onClose={() => setSettings(false)} isPro={user?.subscription === 'pro'} fetchUser={fetchUser} user={user} />}
      {logout && <LogoutConfirmationForm isOpen={logout} onClose={() => setLogout(false)} />}
      {purchase && user && <PurchasePopUp isOpen={purchase} onClose={() => setPurchase(false)} userId={user._id} />}
      {purchaseSuccess && <PurchaseSuccess isOpen={purchaseSuccess} onClose={() => setPurchaseSuccess(false)} />}
      {showWelcome && <UserWelcomeForm isOpen={showWelcome} onClose={() => setShowWelcome(false)} />}
    </div>
  );
};

export default Topbar;
