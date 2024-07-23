import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { updateHabitCompletion } from '@/lib/habit'; // Import the function to update completions
import { useMediaQuery } from 'react-responsive';

const HabitFarmVisual: React.FC<{ habits: any[], selectedHabitId: string, onSelectHabit: (habit: any) => void, handleCompletionUpdate: (habit: any, newCount: number) => void }> = ({ habits = [], selectedHabitId, onSelectHabit, handleCompletionUpdate }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  //  if requested i can add this as a feature
  // const handleIncrement = async (habit) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const formattedDate = today.toISOString();
  //   const todaysOccurrence = habit.occurrences.find(occ => new Date(occ.date).toDateString() === today.toDateString()) || {
  //     date: formattedDate,
  //     completions: 0
  //   };

  //   const newCount = todaysOccurrence.completions + 1;
  //   try {
  //     await updateHabitCompletion(habit._id, newCount, formattedDate);
  //     handleCompletionUpdate(habit, newCount); // Call the handleCompletionUpdate function after increment
  //   } catch (error) {
  //     console.error('Error updating completions:', error);
  //   }
  // };

  const getPlantImage = (plant, streak) => {
    if (streak === 0) {
      return `/icons/habit-farm/beginning.png`;
    } else {
      const plantStage = (streak - 1) % 4 + 1; // Correct stage calculation
      return `/icons/habit-farm/${plant}/${plant}(${plantStage}).png`;
    }
  };

  return (
    <div className="relative flex justify-center items-center mt-[20px]">
      {!isMobile &&
      <div className="absolute left-[-15vw] h-[15vw] w-[15vw] max-w-[350px] max-h-[350px]">
        <Image 
          src="/icons/habit-farm/sunflower.png" 
          alt="Sunflower" 
          layout="fill"
          objectFit="contain"
          style={{ imageRendering: 'pixelated' }} 
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      }
      <div className={`habit-farm-visual grid ${isMobile ? 'grid-cols-3 grid-rows-4' : 'grid-cols-6 grid-rows-2'} mx-4 rounded-xl border-[3px] border-[#DCB889] max-w-[2000px] bg-[#DCB889]`}>
        {Array.from({ length: 12 }).map((_, index) => {
          const habit = habits[index];
          return (
            <div
              key={habit ? habit._id : index}
              className={`md:h-[10vw] md:w-[10vw] max-w-[250px] max-h-[250px] ${habit ? (habit._id === selectedHabitId ? 'selected-habit' : 'bg-[#E9D0A6] text-[#AB7A5A]') : 'bg-[#E9D0A6]'} cursor-pointer border-[5px] border-[#DCB889] flex flex-col items-center justify-around p-4 rounded-sm`}
              onClick={() => {
                if (habit) {
                  // handleIncrement(habit);
                  onSelectHabit(habit);
                }
              }}
            >
              {habit ? (
                <>
                  <Image
                    src={getPlantImage(habit.plant, habit.streak)}
                    alt={`${habit.plant} stage ${habit.streak % 4}`}
                    width={128} // Adjusted size
                    height={128} // Adjusted size
                    style={{ imageRendering: 'pixelated' }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="corner-borders"></div>
                </>
              ) : (
                <div className="text-center md:text-[20px] text-[#AB7A5A]">EMPTY PLOT</div>
              )}
            </div>
          );
        })}
      </div>
      {!isMobile && <div className="absolute right-[-15vw] h-[15vw] w-[15vw] max-w-[350px] max-h-[350px]">
        <Image 
          src="/icons/habit-farm/grapeflower.png" 
          alt="Grapeflower" 
          layout="fill"
          objectFit="contain"
          style={{ imageRendering: 'pixelated' }}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div> }
    </div>
  );
};

export default HabitFarmVisual;
