import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LogoutConfirmationForm: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/auth/signin" });
    router.push(data.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[400px] md:w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">Confirm Logout</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-white text-black px-4 py-2 rounded-lg border-[3px] border-black hover:bg-black hover:text-white text-[20px]"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg border-[3px] border-black hover:bg-white hover:text-black text-[20px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationForm;
