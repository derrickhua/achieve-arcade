import React, { useEffect, useState } from 'react';
import { getAllGoals } from '@/lib/goals';
import GoalCard from '../goal-knight/GoalCard';
import AddButton from './AddButton';
import AddGoalForm from '../forms/AddGoal';
import EditGoalForm from '../forms/EditGoal';
import DeleteGoalForm from '../forms/DeleteGoal';
import { Goal } from '@/lib/goals';

const GoalKnight: React.FC = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isAddGoalFormOpen, setIsAddGoalFormOpen] = useState(false);
  const [isEditGoalFormOpen, setIsEditGoalFormOpen] = useState(false);
  const [isDeleteGoalFormOpen, setIsDeleteGoalFormOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      const data = await getAllGoals();
      setGoals(data);
      console.log(data);
    };

    fetchGoals();
  }, []);

  const openEditGoalForm = (goal) => {
    setGoalToEdit(goal);
    setIsEditGoalFormOpen(true);
  };

  const closeEditGoalForm = () => {
    setGoalToEdit(null);
    setIsEditGoalFormOpen(false);
  };

  const openDeleteGoalForm = (goal) => {
    setGoalToDelete(goal);
    setIsDeleteGoalFormOpen(true);
  };

  const closeDeleteGoalForm = () => {
    setGoalToDelete(null);
    setIsDeleteGoalFormOpen(false);
  };

  const openAddGoalForm = () => {
    setIsAddGoalFormOpen(true);
  };

  const closeAddGoalForm = () => {
    setIsAddGoalFormOpen(false);
  };

  const handleFilterChange = (category) => {
    if (filter === category) {
      setFilter('All');
    } else {
      setFilter(category);
    }
  };

  const filteredGoals = filter === 'All' ? goals : goals.filter(goal => goal.category === filter);

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex items-center">
          <span className='text-[50px] mr-4'>GOAL KNIGHT</span>
          <div className="flex items-center space-x-4 text-[20px]">
            {['Wellness', 'Career', 'Finance', 'Leisure'].map(category => (
              <button
                key={category}
                className={`px-3 py-1 rounded-xl border-[4px] border-black ${
                  filter === category
                    ? 'bg-black text-[#FEFDF2]'
                    : 'bg-[#FEFDF2] text-black hover:text-[#FEFDF2] hover:bg-black'
                }`}
                onClick={() => handleFilterChange(category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <AddButton name="ADD GOAL" onClick={openAddGoalForm} />
      </div>
      <div className="flex flex-wrap justify-between max-w-[1800px] w-full">
        {filteredGoals.map(goal => (
          <div key={goal._id} className="w-full md:w-1/2 p-4">
            <GoalCard
              goal={goal}
              onOpenEditGoalForm={() => openEditGoalForm(goal)}
              onOpenDeleteGoalForm={() => openDeleteGoalForm(goal)}
            />
          </div>
        ))}
      </div>
      {isAddGoalFormOpen && (
        <AddGoalForm
          isOpen={isAddGoalFormOpen}
          onClose={closeAddGoalForm}
          fetchGoals={() => getAllGoals().then(setGoals)}
        />
      )}
      {isEditGoalFormOpen && goalToEdit && (
        <EditGoalForm
          isOpen={isEditGoalFormOpen}
          onClose={closeEditGoalForm}
          fetchGoals={() => getAllGoals().then(setGoals)}
          goal={goalToEdit}
        />
      )}
      {isDeleteGoalFormOpen && goalToDelete && (
        <DeleteGoalForm
          isOpen={isDeleteGoalFormOpen}
          onClose={closeDeleteGoalForm}
          fetchGoals={() => getAllGoals().then(setGoals)}
          goal={goalToDelete}
        />
      )}
    </div>
  );
};

export default GoalKnight;
