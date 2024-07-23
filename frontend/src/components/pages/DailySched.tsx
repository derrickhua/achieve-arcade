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
import { useMediaQuery } from 'react-responsive';
import DateDisplay from '../daily-schedule/center/DateDisplay';
import TaskList from '../daily-schedule/center/TaskList';
import UpdateHoursForm from '../forms/UpdateHours';

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
  const [updateHours, setUpdateHours] = useState<boolean>(false);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Fetch the daily schedule and pass the user's time zone
  const fetchSchedule = async () => {
    try {
      // Get the user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const schedule = await getDailySchedule(userTimezone);
      setDailySchedule(schedule);

      const currentDate = new Date().toLocaleString("en-US", { timeZone: userTimezone });
      const formattedDate = new Date(currentDate).toISOString();
      const metrics = await getWeeklyMetrics(formattedDate, userTimezone);
      setWeeklyMetrics(metrics);
      setLoading(false);
      fetchCoins();

      if (metrics.preferences && Object.keys(metrics.preferences).length === 0) {
        setUpdateHours(true); // Trigger the UpdateHoursForm if preferences are empty
      }
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

  // Convert the schedule date to local date
  const scheduleDateLocal = dailySchedule ? new Date(dailySchedule.date) : new Date();
  const formattedDate = scheduleDateLocal.toLocaleDateString();

  return (
    <div className="p-4 overflow-auto flex flex-col items-center w-full">
      {addBlock && (
        <AddTimeBlockForm
          isOpen={addBlock}
          onClose={() => setAddBlock(false)}
          fetchSchedule={fetchSchedule}
          existingTimeBlocks={dailySchedule?.timeBlocks || []} // Pass existing time blocks
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
      {updateHours && (
        <UpdateHoursForm
          isOpen={updateHours}
          onClose={() => setUpdateHours(false)}
          fetchSchedule={fetchSchedule}
        />
      )}

      <div className="flex justify-between items-center mb-2 md:mb-4 max-w-[1800px] h-full w-full">
        <div className="flex items-center">
          <span className='text-[25px] md:text-[50px] leading-none md:mr-4'>DAILY SCHEDULE</span>
        </div>
        <AddButton name="ADD TIMEBLOCK" onClick={() => setAddBlock(true)} />
      </div>
      <div className="flex flex-col md:flex-row justify-between max-w-[1800px] w-full md:space-x-4 h-full">
        {(dailySchedule && weeklyMetrics) && (
          <>
            {isMobile && <DateDisplay date={scheduleDateLocal.toISOString()} />}
            <ScheduleSection 
              timeBlocks={dailySchedule.timeBlocks} 
              onEdit={handleEdit} 
              onDelete={handleDelete} // Pass handleDelete to ScheduleSection
              fetchSchedule={fetchSchedule} 
            />
            {!isMobile &&
              <CenterSection 
                tasks={dailySchedule.timeBlocks.flatMap(block => block.tasks.map(task => ({ ...task, category: block.category })))}
                notes={dailySchedule.notes || ''} // Ensure notes is a string
                
                onNotesChange={handleNotesChange}  // Pass the callback
                fetchSchedule={fetchSchedule}
              />}
            {
              isMobile && <TaskList 
                tasks={dailySchedule.timeBlocks.flatMap(block => block.tasks.map(task => 
                  ({ ...task, category: block.category })))} 
                fetchSchedule={fetchSchedule} />
            }
          </>
        )}
        {(weeklyMetrics && !isMobile) && (
          <WeeklyHourRequirementsSection weeklyMetrics={weeklyMetrics} />
        )}
      </div>
    </div>
  );
};

export default DailySched;
