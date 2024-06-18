import React, { useState } from 'react';
import Image from 'next/image';
import { Info, MailQuestion, Settings, LogOut } from 'lucide-react';
import SuggestionForm from '../forms/SuggestionForm'; // Adjust the path as needed
import SettingsForm from '../forms/Settings';
import LogoutConfirmationForm from '../forms/Logout';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  coins: number;
}

const Topbar: React.FC<TopbarProps> = ({ coins }) => {
  const [suggestions, setSuggestions] = useState(false);
  const [logout, setLogout] = useState(false);

  const [help, setHelp] = useState(false);
  const [settings, setSettings] = useState(false);

  return (
    <div className="bg-black flex justify-between items-center h-[70px]">
      <div className="flex items-center">
        <div className='w-[100px] flex justify-center'>
          <Image src={'/icons/logo.png'} alt={`company logo icon`} width={40} height={40} quality={100} />
        </div>
        <p className='text-2xl text-[#FEFDF2] text-[50px] ml-4'>ACHIEVE ARCADE</p>
      </div>
      <div className="flex items-center mr-4">
        <span className="flex items-center justify-end text-[#F2C94C] w-[100px] h-[30px] bg-[#FEFDF2] text-[20px] rounded-xl text-right px-3 space-x-1">
          <p className='mt-1'>{coins}</p>
          <Image src={'/icons/coin.png'} alt={`coin icon`} width={20} height={20} quality={100} />
        </span>
        {/* <button className="p-2 ml-2">
          <Info size={32} strokeWidth={2} color="#FEFDF2"/>
        </button> */}
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
      {settings && <SettingsForm isOpen={settings} onClose={() => setSettings(false)} />}
      {logout && <LogoutConfirmationForm isOpen={logout} onClose={() => setLogout(false)} />}

    </div>
  );
};

export default Topbar;
