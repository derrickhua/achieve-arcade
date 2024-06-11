import React, { useState } from 'react';
import AddButton from './AddButton';
import { Dice6 } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Shop: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [selectedChest, setSelectedChest] = useState('wood');

  const chests = [
    { name: 'WOOD CHEST', price: 10, image: '/icons/shop/wood.png', type: 'wood' },
    { name: 'METAL CHEST', price: 60, image: '/icons/shop/metal.png', type: 'metal' },
    { name: 'GOLD CHEST', price: 150, image: '/icons/shop/gold.png', type: 'gold' }
  ];

  const chestProbabilities = {
    wood: [
      { range: '0%', position: '0%', width: '30%', color: 'gray', icons: [] },
      { range: '30%', position: '30%', width: '50%', color: '#8B4513', icons: ['☕', '🍌', '📱', '🎧', '📚', '🛡️'] },
      { range: '80%', position: '80%', width: '15%', color: 'black', icons: ['🎁', '🍪', '🍖', '☀️', '🛏️'] },
      { range: '95%', position: '95%', width: '5%', color: 'gold', icons: ['💎', '🎒'] }
    ],
    metal: [
      { range: '0%', position: '0%', width: '20%', color: 'gray', icons: [] },
      { range: '20%', position: '20%', width: '10%', color: '#8B4513', icons: ['🍇', '🖥️', '📷', '🎮', '📚', '🔧'] },
      { range: '30%', position: '30%', width: '60%', color: 'black', icons: ['🎁', '🍕', '🥩', '🌟', '🛌'] },
      { range: '90%', position: '90%', width: '10%', color: 'gold', icons: ['💍', '🎒'] }
    ],
    gold: [
      { range: '0%', position: '0%', width: '10%', color: 'gray', icons: [] },
      { range: '10%', position: '10%', width: '5%', color: '#8B4513', icons: ['🍓', '📱', '📷', '🎧', '📚', '🛡️'] },
      { range: '15%', position: '15%', width: '20%', color: 'black', icons: ['🎁', '🍩', '🥓', '🌟', '🛏️'] },
      { range: '35%', position: '35%', width: '65%', color: 'gold', icons: ['💎', '🎒'] }
    ]
  };

  return (
    <div className="relative p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex flex-col">
          <span className="text-[50px] mr-4">REWARDS SHOP
            <Dice6 size={50} className="inline-block ml-4 text-[#F2C94C]" />
          </span>
          <span className="text-[40px] text-[#F2C94C]">REWARD YOURSELF, YOU&apos;VE WORKED HARD!</span>
        </div>
        <AddButton name="EDIT REWARDS" onClick={() => {}} />
      </div>
      <div className="flex mt-4 gap-4 max-w-[1800px] w-full h-[600px] items-center justify-center space-x-[70px]">
        {chests.map((chest) => (
          <div key={chest.type} className="flex relative flex-col items-center justify-between py-6 max-w-[400px] 
          max-h-[400px] h-[20vw] w-[20vw] border border-black border-[8px] rounded-3xl">
            <span className='text-[40px]'>{chest.name}</span>
            <Image 
              src={chest.image} 
              alt={chest.name} 
              width={355} 
              height={236} 
              className='absolute left-[70px]'
              style={{ imageRendering: 'pixelated' }}
            />
            <div className='flex flex-col items-center'>
                <span className="text-[30px] mt-4 text-[#F2C94C]">{chest.price} coins
                </span>
                <button className="border rounded-xl border-black hover:bg-black hover:text-[#F2C94C]
                text-[20px] text-black w-[190px] h-[40px]" onClick={() => alert(`Bought ${chest.name} for ${chest.price} coins!`)}>
                BUY CHEST
                </button>
            </div>
          </div>
        ))}
      </div>
      <div className="probabilities-section mt-8 w-full flex flex-col items-center">
      <Select value={selectedChest} onValueChange={(value) => setSelectedChest(value)}>
          <SelectTrigger className="w-[300px] h-[50px] text-[40px] text-center flex justify-center mb-4">
            <SelectValue placeholder="Wood Chest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wood">Wood Chest</SelectItem>
            <SelectItem value="metal">Metal Chest</SelectItem>
            <SelectItem value="gold">Gold Chest</SelectItem>
          </SelectContent>
        </Select>
        <div className="probabilities-display flex mt-4 w-full justify-center max-w-[1800px] border-black border-[5px] rounded-3xl relative">
          {chestProbabilities[selectedChest].map((prob, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center h-[130px] ${index === 0 ? 'rounded-l-2xl' : ''} ${index === chestProbabilities[selectedChest].length - 1 ? 'rounded-r-2xl' : ''}`}
                style={{ backgroundColor: prob.color, width: prob.width }}
              >
                <div className="flex mt-[20px]">
                  {prob.icons.map((icon, i) => (
                    <span key={i} className="reward-icon">{icon}</span>
                  ))}
                </div>
              </div>
              <div className="absolute top-[-40px]" style={{ left: `calc(${prob.position})` }}>
                {prob.range}
              </div>
            </React.Fragment>
          ))}
          <div className="absolute top-[-40px] right-0">
            100%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
