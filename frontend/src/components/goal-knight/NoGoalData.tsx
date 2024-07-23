import Image from "next/image";
import { useMediaQuery } from 'react-responsive';

export default function NoGoalData() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className={`w-full ${isMobile ? 'flex' : 'hidden md:flex'} rounded-lg p-4 md:p-6 h-full flex-col items-center justify-center relative`}>
      {/* Adding multiple images with absolute positioning */}
      <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" 
        width={isMobile ? 125 : 250} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'top-[50px] left-[0px]' : 'top-[100px] left-[100px]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" 
        width={isMobile ? 125 : 250} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'top-[50px] right-[0px]' : 'top-[100px] right-[100px]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" 
        width={isMobile ? 125 : 250} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'bottom-[50px] left-[0px]' : 'bottom-[100px] left-[100px]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" 
        width={isMobile ? 125 : 250} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'bottom-[50px] right-[0px]' : 'bottom-[100px] right-[100px]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />

      <Image src="/icons/goal-knight/goblins/tnt.gif" alt="TNT" 
        width={isMobile ? 96 : 192} height={isMobile ? 96 : 192} 
        className={`absolute ${isMobile ? 'top-[15%] left-[10%]' : 'top-[20%] left-[20%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/tnt.gif" alt="TNT" 
        width={isMobile ? 96 : 192} height={isMobile ? 96 : 192} 
        className={`absolute ${isMobile ? 'top-[1.5%] right-[3.5%] transform scale-x-[-1]' : 'top-[3%] right-[7%] transform scale-x-[-1]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/tnt.gif" alt="TNT" 
        width={isMobile ? 96 : 192} height={isMobile ? 96 : 192} 
        className={`absolute ${isMobile ? 'bottom-[10%] left-[25%]' : 'bottom-[20%] left-[50%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />

      <Image src="/icons/goal-knight/goblins/side-torch.gif" alt="Side Torch" 
        width={isMobile ? 96 : 192} height={isMobile ? 96 : 192} 
        className={`absolute ${isMobile ? 'top-[29.5%] left-[12.5%]' : 'top-[35%] left-[11%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/front-torch.gif" alt="Front Torch" 
        width={isMobile ? 96 : 192} height={isMobile ? 96 : 192} 
        className={`absolute ${isMobile ? 'bottom-[28%] left-[70%]' : 'bottom-[30%] left-[67%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />

      {!isMobile && <Image src="/icons/goal-knight/goblins/goblin-house.png" alt="Goblin House" 
        width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'top-[25%] left-[15%]' : 'top-[30%] left-[30%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        /> }
      <Image src="/icons/goal-knight/goblins/goblin-house.png" alt="Goblin House" 
        width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'top-[19%] right-[25%]' : 'top-[30%] right-[30%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/goblin-house.png" alt="Goblin House" 
        width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'bottom-[35%] left-[30%]' : 'bottom-[30%] right-[60%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />

    <Image src="/icons/goal-knight/goblins/house-destroyed.png" alt="House Destroyed" 
      width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
      className={`absolute ${isMobile ? 'top-[30%] left-[35%]' : 'top-[60%] left-[70%]'}`} 
      onContextMenu={(e) => e.preventDefault()}
        />
    {!isMobile && <Image src="/icons/goal-knight/goblins/house-destroyed.png" alt="House Destroyed" 
      width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
      className={`absolute ${isMobile ? 'top-[25%] right-[10%]' : 'top-[50%] right-[20%]'}`} 
      onContextMenu={(e) => e.preventDefault()}
        /> }

      <Image src="/icons/goal-knight/goblins/tower-destroyed.png" alt="Tower Destroyed" 
        width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'bottom-[25%] left-[10%]' : 'bottom-[50%] left-[20%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />
      <Image src="/icons/goal-knight/goblins/tower-destroyed.png" alt="Tower Destroyed" 
        width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} 
        className={`absolute ${isMobile ? 'bottom-[25%] right-[10%]' : 'bottom-[50%] right-[20%]'}`} 
        onContextMenu={(e) => e.preventDefault()}
        />

      <div className="flex justify-center text-center text-[40px] md:text-[96px] text-[#B65555]">{`NO GOALS??`}</div>
    </div>
  );
}
