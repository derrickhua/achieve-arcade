import React, { useState, useEffect } from 'react';
import AddButton from './AddButton';
import ScheduleSection from '../daily-schedule/SchedSection';
import CenterSection from '../daily-schedule/CenterSection';
import WeeklyHourRequirementsSection from '../daily-schedule/WeeklyRequirements';
import { getDailySchedule, getWeeklyMetrics, updateNotes, TimeBlock as TimeBlockType } from '@/lib/dailySchedule';
import AddTimeBlockForm from '../forms/AddTimeBlock';
import EditTimeBlockForm from '../forms/EditTimeBlock';
import DeleteTimeBlockForm from '../forms/DeleteTimeBlock'; // Import the DeleteTimeBlockForm
import LoadingComponent from './LoadingComponent';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
  category: 'work' | 'leisure' | 'family_friends' | 'atelic'; // Add category to Task interface
}

interface TimeBlock {
  _id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  tasks: Task[];
  category: 'work' | 'leisure' | 'family_friends' | 'atelic';
  completed: boolean;
}

interface DailySchedule {
  _id: string;
  date: Date;
  userId: string;
  timeBlocks: TimeBlock[];
  notes: string;
}

interface WeeklyMetrics {
  work: { hoursSpent: number; hoursLeft: number };
  leisure: { hoursSpent: number; hoursLeft: number };
  family_friends: { hoursSpent: number; hoursLeft: number };
  atelic: { hoursSpent: number; hoursLeft: number };
}

const DailySched: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [dailySchedule, setDailySchedule] = useState<DailySchedule | null>(null);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics | null>(null);
  const [addBlock, setAddBlock] = useState<boolean>(false);
  const [editBlock, setEditBlock] = useState<TimeBlockType | null>(null);
  const [deleteBlock, setDeleteBlock] = useState<TimeBlockType | null>(null); // Add state for delete block
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      const schedule = await getDailySchedule();
      setDailySchedule(schedule);
      const metrics = await getWeeklyMetrics(new Date().toISOString());
      setWeeklyMetrics(metrics);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleEdit = (timeBlock: TimeBlockType) => {
    setEditBlock(timeBlock);
  };

  const handleDelete = (timeBlock: TimeBlockType) => {
    setDeleteBlock(timeBlock); // Set the delete block
  };

  const handleNotesChange = async (newNotes: string) => {
    if (dailySchedule) {
      try {
        const updatedSchedule = { ...dailySchedule, notes: newNotes };
        setDailySchedule(updatedSchedule);
        await updateNotes(newNotes);
      } catch (error) {
        console.error('Error updating notes:', error);
      }
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      {addBlock && (
        <AddTimeBlockForm
          isOpen={addBlock}
          onClose={() => setAddBlock(false)}
          fetchSchedule={fetchSchedule}
        />
      )}
      {editBlock && (
        <EditTimeBlockForm
          isOpen={!!editBlock}
          onClose={() => setEditBlock(null)}
          fetchSchedule={fetchSchedule}
          timeBlock={editBlock}
        />
      )}
      {deleteBlock && ( // Render DeleteTimeBlockForm when deleteBlock is set
        <DeleteTimeBlockForm
          isOpen={!!deleteBlock}
          onClose={() => setDeleteBlock(null)}
          fetchSchedule={fetchSchedule}
          timeBlock={deleteBlock}
        />
      )}
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex items-center">
          <span className='text-[50px] mr-4'>DAILY SCHEDULE</span>
        </div>
        <AddButton name="ADD TIMEBLOCK" onClick={() => setAddBlock(true)} />
      </div>
      <div className="flex justify-between max-w-[1800px] w-full space-x-4 h-full">
        {(dailySchedule && weeklyMetrics) && (
          <>
            <ScheduleSection 
              timeBlocks={dailySchedule.timeBlocks} 
              onEdit={handleEdit} 
              onDelete={handleDelete} // Pass handleDelete to ScheduleSection
              fetchSchedule={fetchSchedule} 
            />
            <CenterSection 
              tasks={dailySchedule.timeBlocks.flatMap(block => block.tasks.map(task => ({ ...task, category: block.category })))}
              notes={dailySchedule.notes || ''} // Ensure notes is a string
              date={new Date(dailySchedule.date).toLocaleDateString()}
              onNotesChange={handleNotesChange}  // Pass the callback
              fetchSchedule={fetchSchedule}
            />
          </>
        )}
        {weeklyMetrics && (
          <WeeklyHourRequirementsSection weeklyMetrics={weeklyMetrics} />
        )}
      </div>
    </div>
  );
};

export default DailySched;
