import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const LoadingComponent = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Image src={`/icons/loading/frog-run.gif`} alt={'frog running'} 
      width={100} height={100} style={{ imageRendering: 'pixelated' }} 
      />
      <p className="text-xl">LOADING{dots}</p>
    </div>
  );
};

export default LoadingComponent;
