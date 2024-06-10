import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';
import ScheduleSection from '../daily-schedule/SchedSection';
import CenterSection from '../daily-schedule/CenterSection';
import WeeklyHourRequirementsSection from '../daily-schedule/WeeklyRequirements';
import { getDailySchedule, getWeeklyMetrics } from '@/lib/dailySchedule';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
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

const exampleTimeBlocks: TimeBlock[] = [
  {
    _id: '1',
    name: 'Work on Project',
    startTime: new Date('2024-06-09T13:00:00'),
    endTime: new Date('2024-06-09T15:00:00'),
    tasks: [
      { _id: 'task1', name: 'Design Module', completed: false },
      { _id: 'task2', name: 'Implement Feature', completed: false }
    ],
    category: 'work',
    completed: false
  }
];

const DailySched: React.FC<{ fetchCoins: () => void }> = ({ fetchCoins }) => {
  const [dailySchedule, setDailySchedule] = useState<DailySchedule | null>(null);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedule = await getDailySchedule();
        setDailySchedule(schedule);

        const metrics = await getWeeklyMetrics(new Date().toISOString());
        setWeeklyMetrics(metrics);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 max-w-[1800px] w-full">
        <div className="flex items-center">
          <span className='text-[50px] mr-4'>DAILY SCHEDULE</span>
        </div>
        <AddButton name="ADD TIMEBLOCK" />
      </div>
      <div className="flex justify-between max-w-[1800px] w-full space-x-4 h-full">
        {dailySchedule && (
          <>
    <ScheduleSection timeBlocks={exampleTimeBlocks} />
    <CenterSection tasks={dailySchedule.timeBlocks.flatMap(block => block.tasks)} notes={dailySchedule.notes} />
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
