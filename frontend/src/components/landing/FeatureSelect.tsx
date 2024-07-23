"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';

const images = [
  { src: '/icons/landing/images/heart.png', alt: 'Heart', width: 40, height: 40, mobileWidth: 30, mobileHeight: 30, style: {}, video: 'player-data.mp4' },
  { src: '/icons/landing/images/warrior.png', alt: 'Warrior', width: 85, height: 85, mobileWidth: 60, mobileHeight: 60, style: { top: '4px' }, video: 'goal-knight.mp4' },
  { src: '/icons/landing/images/sunflower.png', alt: 'Sunflower', width: 40, height: 40, mobileWidth: 30, mobileHeight: 30, style: {}, video: 'habit-farm.mp4' },
  { src: '/icons/landing/images/knight.png', alt: 'Knight', width: 35, height: 80, mobileWidth: 25, mobileHeight: 55, style: { top: '5px' }, video: 'task-slayer.mp4' },
  { src: '/icons/landing/images/calendar.png', alt: 'Calendar', width: 50, height: 40, mobileWidth: 25, mobileHeight: 35, style: {}, video: 'daily-sched.mp4' },
  { src: '/icons/landing/images/gold-chest.png', alt: 'Gold Chest', width: 72, height: 48, mobileWidth: 54, mobileHeight: 36, style: { top: '15px', left: '19px' }, video: 'rewards.mp4' },
];

const FeatureSelect = () => {
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="feature-select flex flex-col items-center mt-8 w-full max-w-[700px]">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => {
              setSelected(index);
              setIsPlaying(false);
            }}
            className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] relative rounded-xl flex justify-center items-center cursor-pointer ${selected === index ? 'border-[#FFA501]' : 'border-white'}`}
            style={{
              borderWidth: '5px',
              borderStyle: 'solid',
            }}
          >
            <div className="absolute" style={image.style}>
              <Image 
                src={image.src} 
                alt={image.alt} 
                width={image.mobileWidth} 
                height={image.mobileHeight} 
                className="md:hidden" 
                style={{ imageRendering: 'pixelated' }} 
                
              />
              <Image 
                src={image.src} 
                alt={image.alt} 
                width={image.width} 
                height={image.height} 
                className="hidden md:block" 
                style={{ imageRendering: 'pixelated' }} 
                
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full md:w-[945px] h-[240px] md:h-[540px] mt-8 md:mt-[60px] relative flex justify-center items-center border-[#FFA501]" style={{ borderWidth: '4px', borderStyle: 'solid', borderRadius: '12px' }}>
        {!isPlaying && (
          <div
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10"
            onClick={handlePlay}
          >
            <button className="text-white bg-[#FFA501] text-[20px] md:text-[30px] rounded-md py-2 px-4 md:py-2 md:px-8 hover:text-[#FFA501] hover:bg-white">
              PLAY
            </button>
          </div>
        )}
        <video 
          ref={videoRef}
          key={images[selected].video}
          src={`/icons/landing/videos/${images[selected].video}`} 
          controls 
          preload="none" 
          autoPlay 
          className="h-full w-full"
          style={{ borderRadius: '10px', display: 'block' }} 
          onPlay={() => setIsPlaying(true)}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default FeatureSelect;
