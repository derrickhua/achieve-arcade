'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /auth/signin after displaying the error message
    const timer = setTimeout(() => {
      router.push('/auth/signin');
    }, 2000); // 2 seconds delay before redirecting

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#FEFDF2]">
      <div className="flex flex-col items-center justify-center">
        <Image 
          src="/icons/habit-farm/where-habits.gif" 
          alt="error" 
          width={200} 
          height={200} 
          priority 
          style={{ imageRendering: 'pixelated' }} 
        />
        <h2>Oops! Something went wrong!</h2>  
      </div>
    </div>
  );
}
