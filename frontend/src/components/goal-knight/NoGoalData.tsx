import Image from "next/image";
export default function NoGoalData() {
    return (
        <div className="w-full rounded-lg p-4 md:p-6 h-full flex flex-col items-center justify-center relative">
        {/* Adding multiple images with absolute positioning */}
        <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" width={250} height={100} className="absolute top-[100px] left-[100px]" />
        <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" width={250} height={100} className="absolute top-[100px] right-[100px]" />
        <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" width={250} height={100} className="absolute bottom-[100px] left-[100px]" />
        <Image src="/icons/goal-knight/goblins/wood-tower.png" alt="Wood Tower" width={250} height={100} className="absolute bottom-[100px] right-[100px]" />
        
        <Image src="/icons/goal-knight/goblins/tnt.gif" alt="TNT" width={192} height={192} className="absolute top-[20%] left-[20%]" />
        <Image src="/icons/goal-knight/goblins/tnt.gif" alt="TNT" width={192} height={192} className="absolute top-[3%] right-[7%] transform scale-x-[-1]" />
        <Image src="/icons/goal-knight/goblins/tnt.gif" alt="TNT" width={192} height={192} className="absolute bottom-[20%] left-[50%]" />

        <Image src="/icons/goal-knight/goblins/side-torch.gif" alt="Side Torch" width={192} height={192} className="absolute top-[35%] left-[11%]" />
        <Image src="/icons/goal-knight/goblins/front-torch.gif" alt="Front Torch" width={192} height={192} className="absolute bottom-[30%] left-[67%]" />

        <Image src="/icons/goal-knight/goblins/goblin-house.png" alt="Goblin House" width={100} height={100} className="absolute top-[30%] left-[30%]" />
        <Image src="/icons/goal-knight/goblins/goblin-house.png" alt="Goblin House" width={100} height={100} className="absolute top-[30%] right-[30%]" />
        <Image src="/icons/goal-knight/goblins/goblin-house.png" alt="Goblin House" width={100} height={100} className="absolute bottom-[30%] right-[60%]" />

        <Image src="/icons/goal-knight/goblins/house-destroyed.png" alt="House Destroyed" width={100} height={100} className="absolute top-[60%] left-[70%]" />
        <Image src="/icons/goal-knight/goblins/house-destroyed.png" alt="House Destroyed" width={100} height={100} className="absolute top-[50%] right-[20%]" />

        <Image src="/icons/goal-knight/goblins/tower-destroyed.png" alt="Tower Destroyed" width={100} height={100} className="absolute bottom-[50%] left-[20%]" />
        <Image src="/icons/goal-knight/goblins/tower-destroyed.png" alt="Tower Destroyed" width={100} height={100} className="absolute bottom-[50%] right-[20%]" />

        <div className="flex justify-center text-center text-[96px] text-[#B65555]">{`NO GOALS??`}</div>
        </div>
    );
}