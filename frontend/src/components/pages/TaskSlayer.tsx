import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';
import TaskSquare from '../task-slayer/TaskSquare';
import AddTaskForm from '../forms/AddTask';
import DeleteTaskForm from '../forms/DeleteTask';
import { getTasks, updateTask } from '@/lib/task';
import Image from 'next/image';
import './taskcursor.css';
import LoadingComponent from './LoadingComponent';

// Chosen 7 monsters for absolute positioning
const chosenMonsters = [
  "big-demon",
  "big-orc",
  "doc",
  "ice-zombie",
  "lizard",
  "mask-orc",
  "mini-demon"
];

const TaskSlayer: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [addTask, setAddTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log(response);
      setCompletedTaskCount(response.completedTaskCount);
      setTasks(response.uncompletedTasks);
      setLoading(false)
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
  
    if (cursor) {
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
    }
  }, [loading]);

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

  if (loading) {
    return <LoadingComponent />;
  }


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
      {tasks.length === 0 && (
      <div className="relative flex flex-col items-center justify-center h-full w-[1800px]">
        <div className="flex justify-center space-x-[100px] mb-8">
          <div className='flex'>
            <Image src={`/icons/task-slayer/${chosenMonsters[0]}.gif`} alt={chosenMonsters[0]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
            <Image src={`/icons/task-slayer/${chosenMonsters[1]}.gif`} alt={chosenMonsters[1]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
            <Image src={`/icons/task-slayer/${chosenMonsters[2]}.gif`} alt={chosenMonsters[2]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
            <Image src={`/icons/task-slayer/${chosenMonsters[3]}.gif`} alt={chosenMonsters[3]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
            <Image src={`/icons/task-slayer/${chosenMonsters[4]}.gif`} alt={chosenMonsters[4]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
            <Image src={`/icons/task-slayer/${chosenMonsters[5]}.gif`} alt={chosenMonsters[5]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
            <Image src={`/icons/task-slayer/${chosenMonsters[6]}.gif`} alt={chosenMonsters[6]} width={60} height={60} style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className='flex'>
            <Image src="/icons/task-slayer/knight-idle.gif" alt="knight-idle" width={60} height={60} style={{ imageRendering: 'pixelated', transform: 'scaleX(-1)' }} />
            <p className='ml-4'>I CAN&apos;T STOP <br />
            BOUNCING</p>
          </div>

        </div>
        <p className="text-center text-[40px] text-[#EB5757]">No tasks available. Add a new task to start slaying monsters!</p>
      </div>
    )}



      {addTask && <AddTaskForm fetchTasks={fetchTasks} onClose={() => setAddTask(false)} isOpen={addTask} />}
      {deleteTask && <DeleteTaskForm task={selectedTask} fetchTasks={fetchTasks} onClose={() => setDeleteTask(false)} isOpen={deleteTask} />}
    </div>
  );
};

export default TaskSlayer;
