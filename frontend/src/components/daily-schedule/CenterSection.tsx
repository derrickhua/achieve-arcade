import React from 'react';
import DateDisplay from './center/DateDisplay';
import TaskList from './center/TaskList';
import NotesSection from './center/NoteSection';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

interface CenterSectionProps {
  tasks: Task[];
  notes: string;
  date: string;
  onNotesChange: (notes: string) => void;
  fetchSchedule: () => void;
}

const CenterSection: React.FC<CenterSectionProps> = ({ tasks, notes, date, onNotesChange, fetchSchedule }) => {
  return (
    <div className="flex flex-col w-[40%] h-full p-4 rounded-lg ">
      <DateDisplay date={date} />
      <TaskList tasks={tasks} fetchSchedule={fetchSchedule} />
      <NotesSection notes={notes} onNotesChange={onNotesChange} />
    </div>
  );
};

export default CenterSection;
