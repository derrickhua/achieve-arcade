import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';
import { Dice6 } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getAllRewards, purchaseChest } from '@/lib/rewards';
import EditRewardsForm from '../forms/EditRewards';
import RewardPopup from '../rewards-shop/RewardPopUp';
import LoadingComponent from './LoadingComponent';

const Shop: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [selectedChest, setSelectedChest] = useState('Wood');
  const [rewards, setRewards] = useState({ wood: [], metal: [], gold: [] });
  const [isEditRewardsOpen, setIsEditRewardsOpen] = useState(false);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [reward, setReward] = useState({});
  const [chestType, setChestType] = useState('');
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  const fetchRewards = async () => {
    try {
      const allRewards = await getAllRewards();
      const categorizedRewards = { wood: [], metal: [], gold: [] };

      allRewards.forEach(reward => {
        if (reward.chestType.toLowerCase() === 'wood') {
          categorizedRewards.wood.push(reward);
        } else if (reward.chestType.toLowerCase() === 'metal') {
          categorizedRewards.metal.push(reward);
        } else if (reward.chestType.toLowerCase() === 'gold') {
          categorizedRewards.gold.push(reward);
        }
      });

      setRewards(categorizedRewards);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    }
  };

  const handlePurchaseChest = async (chestType) => {
    try {
      playSound('/sounds/shop/chest-purchase.wav'); // Play the sound
      const capitalizedChestType = chestType.charAt(0).toUpperCase() + chestType.slice(1);
      const rewardResponse = await purchaseChest(capitalizedChestType);
      console.log('reward', rewardResponse);
  
      if (!rewardResponse || !rewardResponse.name) {
        setReward({ name: 'Absolutely Nothing!', icon: '' });
      } else {
        setReward(rewardResponse);
      }
      setChestType(capitalizedChestType);
      setIsRewardPopupOpen(true);
      fetchCoins(); // Fetch coins after purchase
    } catch (error) {
      console.error('Error purchasing chest:', error);
    }
  };

  useEffect(() => {
    fetchRewards()
  }, []);

  const chests = [
    { name: 'WOOD CHEST', price: 10, image: '/icons/shop/wood.png', type: 'Wood' },
    { name: 'METAL CHEST', price: 60, image: '/icons/shop/metal.png', type: 'Metal' },
    { name: 'GOLD CHEST', price: 150, image: '/icons/shop/gold.png', type: 'Gold' },
  ];

  const chestProbabilities = {
    wood: [
      { range: '0%', position: '0%', width: '30%', color: 'gray', icons: [] },
      { range: '30%', position: '30%', width: '50%', color: '#8B4513', icons: rewards.wood.map(r => r.icon) },
      { range: '80%', position: '80%', width: '15%', color: 'black', icons: rewards.metal.map(r => r.icon) },
      { range: '95%', position: '95%', width: '5%', color: 'gold', icons: rewards.gold.map(r => r.icon) },
    ],
    metal: [
      { range: '0%', position: '0%', width: '20%', color: 'gray', icons: [] },
      { range: '20%', position: '20%', width: '10%', color: '#8B4513', icons: rewards.wood.map(r => r.icon) },
      { range: '30%', position: '30%', width: '60%', color: 'black', icons: rewards.metal.map(r => r.icon) },
      { range: '90%', position: '90%', width: '10%', color: 'gold', icons: rewards.gold.map(r => r.icon) },
    ],
    gold: [
      { range: '0%', position: '0%', width: '10%', color: 'gray', icons: [] },
      { range: '10%', position: '10%', width: '5%', color: '#8B4513', icons: rewards.wood.map(r => r.icon) },
      { range: '15%', position: '15%', width: '20%', color: 'black', icons: rewards.metal.map(r => r.icon) },
      { range: '35%', position: '35%', width: '65%', color: 'gold', icons: rewards.gold.map(r => r.icon) },
    ],
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="relative p-4 justify-around overflow-auto flex flex-col items-center md:h-full w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex flex-col">
          <span className="text-[20px] sm:text-[35px] md:text-[50px] md:mr-4 leading-none">REWARDS SHOP</span>
          {!isMobile && 
            <span className="text-[20px] md:text-[40px] text-[#F2C94C] leading-none">
              REWARD YOURSELF, YOU&apos;VE WORKED HARD!</span>
          }
        </div>
        <AddButton name="EDIT REWARDS" onClick={() => setIsEditRewardsOpen(true)} />
      </div>
      <div className="flex flex-col md:flex-row md:mt-4 md:gap-4 max-w-[1800px] w-full gap-4 md:h-auto 
      md:h-[600px] items-center justify-around md:justify-center space-x-0 md:space-x-[70px]">
        {chests.map((chest) => (
          <div key={chest.type} className="flex relative flex-col items-center justify-between py-2 md:py-6 
          max-w-[190px] 
          max-h-[190px]
          md:max-w-[400px] 
          md:max-h-[400px] h-[100vw] 
          w-[100vw] md:h-[20vw] aspect-square
          md:w-[20vw] border border-black border-[8px] rounded-3xl">
            <span className="text-[20px] md:text-[40px]">{chest.name}</span>
            <Image
              src={chest.image}
              alt={chest.name}
              width={isMobile ? 179: 355}
              height={isMobile ? 100: 236}
              className="absolute bottom-[65px] md:bottom-[120px] left-[30px] md:left-[70px]"
              style={{ imageRendering: 'pixelated' }}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="flex flex-col items-center">
              <span className="text-[20px] md:text-[30px] mt-4 text-[#F2C94C]">{chest.price} coins</span>
              <button
                className="border rounded-lg md:rounded-xl border-black hover:bg-black hover:text-[#F2C94C] text-[20px] text-black w-[150px] md:w-[190px] h-[30px] md:h-[40px]"
                onClick={() => handlePurchaseChest(chest.type)}
              >
                BUY CHEST
              </button>
            </div>
          </div>
        ))}
      </div>
      {!isMobile && (
        <div className="probabilities-section mt-8 w-full flex flex-col items-center">
          <Select value={selectedChest} onValueChange={(value) => setSelectedChest(value)}>
            <SelectTrigger className="w-[200px] md:w-[300px] h-[40px] md:h-[50px] text-[20px] md:text-[40px] text-center flex justify-center mb-4">
              <SelectValue placeholder="Wood Chest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wood">Wood Chest</SelectItem>
              <SelectItem value="Metal">Metal Chest</SelectItem>
              <SelectItem value="Gold">Gold Chest</SelectItem>
            </SelectContent>
          </Select>

          <div className="probabilities-display flex flex-col md:flex-row mt-4 w-full justify-center max-w-[1800px] border-black border-[5px] rounded-3xl relative">
            {chestProbabilities[selectedChest.toLowerCase()].map((prob, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex flex-col items-center h-[100px] md:h-[130px] ${index === 0 ? 'rounded-t-2xl md:rounded-l-2xl' : ''} ${index === chestProbabilities[selectedChest.toLowerCase()].length - 1 ? 'rounded-b-2xl md:rounded-r-2xl' : ''}`}
                  style={{ backgroundColor: prob.color, width: prob.width, flexWrap: 'wrap', overflow: 'hidden' }}
                >
                  <div className="flex mt-[10px] md:mt-[20px] flex-wrap justify-center">
                    {prob.icons.map((icon, i) => (
                      <span key={i} className="reward-icon">{icon}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-[-20px] md:top-[-40px]" style={{ left: `calc(${prob.position})` }}>
                  {prob.range}
                </div>
              </React.Fragment>
            ))}
            <div className="absolute top-[-20px] md:top-[-40px] right-0">
              100%
            </div>
          </div>
        </div>
      )}
      <EditRewardsForm
        isOpen={isEditRewardsOpen}
        onClose={() => setIsEditRewardsOpen(false)}
        fetchRewards={fetchRewards}
        rewards={rewards}
      />
      {isRewardPopupOpen && (
        <RewardPopup
          reward={reward}
          chestType={chestType}
          onClose={() => setIsRewardPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default Shop;
