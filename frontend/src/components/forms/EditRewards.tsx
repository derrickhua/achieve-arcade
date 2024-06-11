import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateReward, createReward, deleteReward, getAllRewards } from '@/lib/rewards';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EmojiPicker from '../rewards-shop/EmojiPicker';
import { Plus, Trash } from 'lucide-react';

const emojis = [
  '☕', '🍪', '🛋️', '📺', '🚶‍♂️', '🍰', '✏️', '🎧', '🎮', '📖',
  '💃', '🍽️', '📚', '🎬', '🏖️', '🏛️', '🛠️', '💆', '👗', '🥂',
  '🌴', '💻', '🧖', '🌄', '✈️', '🛋️', '💻', '🍣', '⌚', '🍾',
  '🍕', '🍔', '🍟', '🌭', '🍿', '🥓', '🥚', '🧇', '🥞', '🧀',
  '🍎', '🍊', '🍌', '🍉', '🍇', '🍓', '🥝', '🍅', '🥑', '🥦',
  '🌶️', '🌽', '🥕', '🍄', '🥔', '🍠', '🍯', '🥜', '🍳', '🍗',
  '🍖', '🍤', '🥗', '🍝', '🍜', '🍣', '🍱', '🍛', '🍲', '🍥'
];

const EditRewardsForm: React.FC<{ isOpen: boolean, onClose: () => void, fetchRewards: () => void, rewards: any }> = ({ isOpen, onClose, fetchRewards, rewards }) => {
  const [selectedChestType, setSelectedChestType] = useState('Wood');
  const [chestRewards, setChestRewards] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(null);

  useEffect(() => {
    if (isOpen) {
      filterRewardsByChestType(selectedChestType);
    }
  }, [isOpen, selectedChestType, rewards]);

  const filterRewardsByChestType = (chestType: string) => {
    setChestRewards(rewards[chestType.toLowerCase()]);
  };

  const handleIconChange = (index: number, value: string) => {
    const newRewards = [...chestRewards];
    newRewards[index].icon = value;
    setChestRewards(newRewards);
  };

  const handleNameChange = (index: number, value: string) => {
    const newRewards = [...chestRewards];
    newRewards[index].name = value;
    setChestRewards(newRewards);
  };

  const handleAddReward = () => {
    setChestRewards([...chestRewards, { icon: '', name: '', chestType: selectedChestType }]);
  };

  const handleRemoveReward = async (index: number) => {
    const rewardToRemove = chestRewards[index];
    if (rewardToRemove._id) {
      try {
        await deleteReward(rewardToRemove._id);
      } catch (error) {
        console.error('Error deleting reward:', error);
        setShowAlert(true);
        setAlertMessage('Error deleting reward. Please try again.');
        return;
      }
    }
    const newRewards = chestRewards.filter((_, i) => i !== index);
    setChestRewards(newRewards);
  };

  const handleSave = async () => {
    try {
      for (const reward of chestRewards) {
        if (reward._id) {
          await updateReward(reward._id, reward);
        } else {
          await createReward(reward);
        }
      }
      setShowAlert(true);
      setAlertMessage('Rewards updated successfully!');
      fetchRewards();
    } catch (error) {
      console.error('Error updating rewards:', error);
      setShowAlert(true);
      setAlertMessage('Error updating rewards. Please try again.');
    }
  };

  const openEmojiPicker = (index) => {
    setCurrentEmojiIndex(index);
    setIsEmojiPickerOpen(true);
  };

  const handleEmojiSelect = (emoji) => {
    handleIconChange(currentEmojiIndex, emoji);
    setIsEmojiPickerOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">EDIT REWARDS</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Treat yourself fairly!</p>

        <div className="mb-4">
          <label className="block text-black text-[25px] mb-2" htmlFor="chestType">Chest Type</label>
          <Select onValueChange={setSelectedChestType} value={selectedChestType}>
            <SelectTrigger className="w-full bg-white border border-[#BDBDBD]">
              <SelectValue placeholder="Select Chest Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wood">Wood</SelectItem>
              <SelectItem value="Metal">Metal</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-black text-[25px] mb-2">Rewards</label>
          <div className='max-h-[800px] overflow-y-auto'>
            {chestRewards.map((reward, index) => (
            <div key={index} className="flex mb-2 space-x-2">
                <button
                className="w-1/5 px-2 py-1 border border-[#BDBDBD] rounded-lg bg-white"
                onClick={() => openEmojiPicker(index)}
                >
                {reward.icon || 'Select Emoji'}
                </button>
                <input
                className="w-4/5 px-2 py-1 border border-[#BDBDBD] rounded-lg"
                type="text"
                value={reward.name}
                onChange={e => handleNameChange(index, e.target.value)}
                placeholder="Name"
                />
                <button className="text-black h-[40px] w-[40px] flex justify-center items-center hover:bg-black hover:text-white rounded-xl border border-black" onClick={() => handleRemoveReward(index)}>
                <Trash size={20} />
                </button>
            </div>
            ))}
        </div>
          <button className="mt-4 text-[40px] text-[#F2C94C] w-full flex justify-center"    >
            <div className='border-[4px] hover:bg-black bg-[#F2C94C] border-black h-[50px] w-[50px] flex justify-center items-center rounded-xl' onClick={handleAddReward}>
              <Plus size={40} strokeWidth={4} className='text-black hover:text-[#F2C94C]' />
            </div>
          </button>
        </div>

        {showAlert && (
          <Alert className="mb-4" variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
            <AlertTitle>{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
            <AlertDescription>
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        {isEmojiPickerOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setIsEmojiPickerOpen(false)}>
            <div className="bg-white rounded-xl p-4 relative" onClick={e => e.stopPropagation()}>
              <EmojiPicker emojis={emojis} onSelect={handleEmojiSelect} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRewardsForm;
