import React, { useState, useEffect } from 'react';
import { getDashboardMetrics } from '@/lib/dashboard';
import { getUserPreferences } from '@/lib/user';
import LineChart from '../data-visuals/LineChart';
import LineChartTimeBlock from '../data-visuals/LineChartTimeBlock';
import SquareBlock from '../layout/SquareBlock';
import LoadingComponent from './LoadingComponent';
import UserWelcomeForm from '../forms/UserWelcomeForm';

const PlayerData: React.FC = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);

        const userPreferences = await getUserPreferences();
        setPreferences(userPreferences);

        if (
          userPreferences.workHoursPerWeek === 0 &&
          userPreferences.leisureHoursPerWeek === 0 &&
          userPreferences.familyFriendsHoursPerWeek === 0 &&
          userPreferences.atelicHoursPerWeek === 0
        ) {
          setShowWelcomeForm(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
      {showWelcomeForm && <UserWelcomeForm onClose={() => setShowWelcomeForm(false)} />}
      <div className="flex flex-wrap justify-between mb-4 max-w-[1800px] w-full text-[50px]">
        PLAYER DATA
      </div>
      <div className="flex flex-wrap justify-between mb-4 max-w-[1800px] w-full">
        <div className="w-full md:w-2/3 rounded-lg border-black border-[3px] bg-[#FEFDF2]">
          <LineChart timeData={metrics.plannedVsRealizedTime} />
        </div>
        <div className="w-full md:w-1/3 flex flex-wrap max-w-[450px] place-items-center gap-4 h-full">
          <SquareBlock label="Milestones Completed" value={metrics.milestonesCompleted} color="#000000" />
          <SquareBlock label="Goals Achieved" value={metrics.goalsAchieved} color="#000000" />
          <SquareBlock label="Active Habits" value={metrics.activeStreaks} color="#000000" />
          <SquareBlock label="Tasks Completed" value={metrics.totalTasksCompleted} color="#000000" />
        </div>
      </div>
      <div className="flex flex-wrap justify-between max-w-[1800px] w-full">
        <div className="w-full md:w-2/3 rounded-lg border-black border-[3px] bg-[#FEFDF2]">
          <LineChartTimeBlock averageTimeBlockEfficiency={metrics.averageTimeBlockEfficiency} />
        </div>
        <div className="w-full md:w-1/3 place-items-center max-w-[450px] flex flex-wrap gap-4">
          <SquareBlock label="Work Hours" value={metrics.categoryHours.work} color="#b82c05" />
          <SquareBlock label="Leisure Hours" value={metrics.categoryHours.leisure} color="#73926d" />
          <SquareBlock label="Social Hours" value={metrics.categoryHours.family_friends} color="#efbf7b" />
          <SquareBlock label="Atelic Hours" value={metrics.categoryHours.atelic} color="#a3bdb6" />
        </div>
      </div>
    </div>
  );
};

export default PlayerData;
