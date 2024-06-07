import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';
import TaskSquare from '../task-slayer/TaskSquare';
import AddTaskForm from '../forms/AddTask';
import DeleteTaskForm from '../forms/DeleteTask';
import { getTasks, updateTask } from '@/lib/task';
import './taskcursor.css';

const TaskSlayer: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [addTask, setAddTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log(response);
      setCompletedTaskCount(response.completedTaskCount);
      setTasks(response.uncompletedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Set to empty array in case of error
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseDown = () => {
      cursor.classList.add('custom-cursor-click');
      setTimeout(() => {
        cursor.classList.remove('custom-cursor-click');
      }, 500); // Duration of the animation
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setDeleteTask(true);
  };

  const handleCompleteTask = async (task) => {
    try {
      await updateTask(task._id, { completed: true });
      await fetchTasks();
      fetchCoins()
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="task-slayer-container relative p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="custom-cursor"></div>
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex flex-col">
          <span className="text-[50px] mr-4">Task Slayer</span>
          <span className="text-[40px] text-[#EB5757]">TOTAL # OF MONSTERS SLAIN: {completedTaskCount}</span>
        </div>
        <AddButton name="ADD TASK" onClick={() => { setAddTask(true); }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[1800px] w-full place-items-center">
        {tasks && tasks.map(task => (
          <TaskSquare key={task._id} task={task} onDelete={handleDeleteTask} onComplete={handleCompleteTask} />
        ))}
      </div>
      {
        addTask && <AddTaskForm fetchTasks={fetchTasks} onClose={() => setAddTask(false)} isOpen={addTask} />
      }
      {
        deleteTask && <DeleteTaskForm task={selectedTask} fetchTasks={fetchTasks} onClose={() => setDeleteTask(false)} isOpen={deleteTask} />
      }
    </div>
  );
};

export default TaskSlayer;
