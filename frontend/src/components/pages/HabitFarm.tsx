import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';
import DataVisualSection from '../habit-farm/DataVisual';
import HabitNavigation from '../habit-farm/HabitNavigation';
import HabitFarmVisual from '../habit-farm/HabitFarmVisual';
import AddHabitForm from '../forms/AddHabit';
import EditHabitForm from '../forms/EditHabit';
import DeleteHabitForm from '../forms/DeleteHabit';
import { getHabits, updateHabitCompletion } from '@/lib/habit';
import Image from 'next/image';
import LoadingComponent from './LoadingComponent';

const HabitFarm: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isAddHabitFormOpen, setIsAddHabitFormOpen] = useState(false);
  const [isEditHabitFormOpen, setIsEditHabitFormOpen] = useState(false);
  const [isDeleteHabitFormOpen, setIsDeleteHabitFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
    
      if (!Array.isArray(data)) {
        console.error('Fetched data is not an array:', data);
        throw new Error('Fetched data is not an array');
      }

      setHabits(data);
      fetchCoins(); // Fetch coins after updating habits

      if (data.length > 0) {
        // Check if the currently selected habit still exists
        if (selectedHabit) {
          const habitExists = data.some(habit => habit._id === selectedHabit._id);
          if (!habitExists) {
            setSelectedHabit(data[0]); // Select the first habit if the current one no longer exists
          } else {
            const updatedSelectedHabit = data.find(habit => habit._id === selectedHabit._id);
            setSelectedHabit(updatedSelectedHabit); // Ensure selected habit is up-to-date
          }
        } else {
          setSelectedHabit(data[0]); // Select the first habit if none is currently selected
        }
      } else {
        setSelectedHabit(null); // No habits available
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCompletionUpdate = async (habit, newCount) => {
    try {
      await updateHabitCompletion(habit._id, newCount, new Date().toISOString());
      const updatedHabits = await getHabits(); // Fetch updated habits

      if (!Array.isArray(updatedHabits)) {
        console.error('Fetched updated data is not an array:', updatedHabits);
        throw new Error('Fetched updated data is not an array');
      }

      setHabits(updatedHabits);
      const updatedHabit = updatedHabits.find(h => h._id === habit._id);
      setSelectedHabit(updatedHabit); // Update the selected habit with the new data
      fetchCoins(); // Fetch coins after updating habits
    } catch (error) {
      console.error('Error updating completions:', error);
    }
  };

  const handleHabitSelect = (habit) => {
    setSelectedHabit(habit);
  };

  const handleOpenEditHabitForm = () => {
    setIsEditHabitFormOpen(true);
  };

  const handleOpenDeleteHabitForm = () => {
    setIsDeleteHabitFormOpen(true);
  };

  if (loading) {
    return <LoadingComponent />;
  }


  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex items-center">
          <span className="text-[50px] mr-4">HABIT FARM</span>
        </div>
        <AddButton name="ADD HABIT" onClick={() => setIsAddHabitFormOpen(true)} />
      </div>

      <div className="flex flex-col items-center max-w-[1800px] h-full w-full">
        {habits.length > 0 ? (
          <>
            <DataVisualSection 
              habit={selectedHabit} 
              onOpenEditHabitForm={handleOpenEditHabitForm} 
              onOpenDeleteHabitForm={handleOpenDeleteHabitForm} 
              fetchHabits={fetchHabits}
              handleCompletionUpdate={handleCompletionUpdate}
            />
            <HabitNavigation 
              habits={habits} 
              selectedHabitId={selectedHabit?._id}
              onSelectHabit={handleHabitSelect} 
            />
            <div className='max-w-[2000px]'>
            </div>
          </>
        ) : (
          <div className="text-center text-[30px] h-[400px] relative flex flex-col items-center justify-center">
          <div className="relative">
            <Image 
              src="/icons/habit-farm/where-habits.gif" 
              width={200} 
              height={200} 
              alt="No habits available"  
              style={{ imageRendering: 'pixelated', margin: 'auto' }}
              className="mx-auto"
            />
            <div className="absolute top-1/2 left-2/3 ml-4 transform -translate-y-1/2 text-black p-2  text-center text-base">
              - Where are my carrots?
            </div>
          </div>
          <p className='text-[40px] text-[#8DB15C] mt-4'>No habits available. Add a new habit to get started!</p>
        </div>
          )}
          <HabitFarmVisual
            habits={habits}
            selectedHabitId={selectedHabit?._id}
            onSelectHabit={handleHabitSelect}
            handleCompletionUpdate={handleCompletionUpdate} // Pass the handleCompletionUpdate function
          />
      </div>

      {isAddHabitFormOpen && (
        <AddHabitForm 
          isOpen={isAddHabitFormOpen} 
          onClose={() => setIsAddHabitFormOpen(false)} 
          fetchHabits={fetchHabits} 
          habits={habits}
        />
      )}

      {isEditHabitFormOpen && selectedHabit && (
        <EditHabitForm 
          isOpen={isEditHabitFormOpen} 
          onClose={() => {
            setIsEditHabitFormOpen(false);
            fetchHabits(); // Ensure habits are refetched after editing
          }} 
          fetchHabits={fetchHabits} 
          habit={selectedHabit}
        />
      )}

      {isDeleteHabitFormOpen && selectedHabit && (
        <DeleteHabitForm 
          isOpen={isDeleteHabitFormOpen} 
          onClose={() => {
            setIsDeleteHabitFormOpen(false);
            fetchHabits(); // Ensure habits are refetched after deleting
          }} 
          fetchHabits={fetchHabits} 
          habit={selectedHabit}
        />
      )}
    </div>
  );
};

export default HabitFarm;
