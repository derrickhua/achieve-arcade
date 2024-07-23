import React from 'react';
import { updateTask } from '@/lib/task';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
  category: 'work' | 'leisure' | 'family_friends' | 'atelic'; // Add category to Task interface
}

interface TaskListProps {
  tasks: Task[];
  fetchSchedule: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, fetchSchedule }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return 'bg-[#b82c05]'; // Customize colors as needed
      case 'leisure':
        return 'bg-[#73926d]';
      case 'family_friends':
        return 'bg-[#efbf7b]';
      case 'atelic':
        return 'bg-[#a3bdb6]';
      default:
        return 'bg-gray-500 border-gray-700';
    }
  };

  const handleTaskCompletion = async (task: Task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchSchedule(); // Refresh the schedule after updating the task
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="my-4 md:my-0 md:mb-4 p-2 md:p-4 
    md:max-h-[580px] md:overflow-y-auto bg-[#FEFDF2] border-[2px] 
    text-[#FEFDF2] border-dashed border-black rounded-xl md:rounded-3xl w-full">
      <h2 className="text-black md:text-[30px] mb-2">TODAY&apos;S TASKS</h2>
      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`flex items-center p-2 text-[15px] leading-none md:text-[20px] border rounded-lg md:rounded-xl border-black ${getCategoryColor(task.category)}`}
          >
            <label className="flex items-center cursor-pointer w-full md:px-4">
              <span className="flex-grow">{task.name}</span>
              <input
                type="checkbox"
                className={`mr-2 rounded ${task.completed ? 'text-black' : 'text-blue-500'}`}
                checked={task.completed}
                onChange={() => handleTaskCompletion(task)} // Handle task completion change
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
