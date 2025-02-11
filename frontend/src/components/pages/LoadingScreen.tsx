import React, { useState, useEffect } from 'react';
import Image from 'next/image';
const LoadingScreen = () => {
    const [dots, setDots] = useState('');
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
      }, 500);
  
      return () => clearInterval(interval);
    }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FEFDF2] z-50">
            <Image src={`/icons/loading/frog-run.gif`} alt={'frog running'} width={100} height={100} 
            style={{ imageRendering: 'pixelated' }} unoptimized
            />
            <p className="text-xl text-black">LOADING{dots}</p>
    </div>
  );
};

export default LoadingScreen;
