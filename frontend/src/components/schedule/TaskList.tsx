import React from 'react';
import { Task } from '@/lib/dailySchedule';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  color: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete, color }) => {
  return (
    <div className="flex flex-wrap items-start w-full gap-1 h-full ml-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`flex items-center rounded-lg p-2 h-full max-h-[45px]`}
          style={{ backgroundColor: color, minWidth: '100px' }}
        >
          <span className='mr-2'>{task.name}</span>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onTaskComplete(task._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
