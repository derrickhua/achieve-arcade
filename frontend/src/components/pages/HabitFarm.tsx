import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';
import DataVisualSection from '../habit-farm/DataVisual';
import HabitNavigation from '../habit-farm/HabitNavigation';
import HabitFarmVisual from '../habit-farm/HabitFarmVisual';
import AddHabitForm from '../forms/AddHabit';
import EditHabitForm from '../forms/EditHabit';
import DeleteHabitForm from '../forms/DeleteHabit';
import { getHabits } from '@/lib/habit';

const HabitFarm: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isAddHabitFormOpen, setIsAddHabitFormOpen] = useState(false);
  const [isEditHabitFormOpen, setIsEditHabitFormOpen] = useState(false);
  const [isDeleteHabitFormOpen, setIsDeleteHabitFormOpen] = useState(false);

  const fetchHabits = async () => {
    try {
      const { data } = await getHabits();
      setHabits(data);
      fetchCoins(); // Fetch coins after updating habits

      if (data.length > 0) {
        // Check if the currently selected habit still exists
        if (selectedHabit) {
          const habitExists = data.some(habit => habit._id === selectedHabit._id);
          if (!habitExists) {
            setSelectedHabit(data[0]); // Select the first habit if the current one no longer exists
          }
        } else {
          setSelectedHabit(data[0]); // Select the first habit if none is currently selected
        }
      } else {
        setSelectedHabit(null); // No habits available
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleHabitSelect = (habit) => {
    setSelectedHabit(habit);
  };

  const handleOpenEditHabitForm = () => {
    setIsEditHabitFormOpen(true);
  };

  const handleOpenDeleteHabitForm = () => {
    setIsDeleteHabitFormOpen(true);
  };

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex items-center">
          <span className='text-[50px] mr-4'>HABIT FARM</span>
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
            />
            <HabitNavigation 
              habits={habits} 
              selectedHabitId={selectedHabit?._id}
              onSelectHabit={handleHabitSelect} 
            />
            <HabitFarmVisual habits={habits} />
          </>
        ) : (
          <div className="text-center text-[30px]">No habits available. Add a new habit to get started!</div>
        )}
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
