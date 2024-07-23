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
    <div className="gap-4 md:gap-0 md:p-4 overflow-auto flex flex-col items-center md:h-full w-full">
      {showWelcomeForm && <UserWelcomeForm onClose={() => setShowWelcomeForm(false)} />}
      <div className="flex flex-wrap justify-between md:mb-4 max-w-[1800px] w-full text-[25px] sm:text-[35px] md:text-[50px]">
        PLAYER DATA
      </div>
      {metrics &&
        (
          <>
            <div className="flex flex-col md:flex-row justify-between md:mb-4 max-w-[1800px] w-full">
              <div className="w-full max-h-[400px]  md:w-2/3 rounded-lg border-black border-[3px] bg-[#FEFDF2] mb-4 md:mb-0">
                <LineChart timeData={metrics.plannedVsRealizedTime} />
              </div>
              <div className="w-full max-h-[400px]  md:hidden rounded-lg border-black border-[3px] bg-[#FEFDF2] mb-4 md:mb-0">
                <LineChartTimeBlock averageTimeBlockEfficiency={metrics.averageTimeBlockEfficiency} />
              </div>
              <div className="w-full md:w-1/3 flex md:flex-wrap max-w-[450px] place-items-center justify-around md:gap-4 h-full">
                <SquareBlock label="Milestones Completed" value={metrics.milestonesCompleted} color="#000000" />
                <SquareBlock label="Goals Achieved" value={metrics.goalsAchieved} color="#000000" />
                <SquareBlock label="Active Habits" value={metrics.activeStreaks} color="#000000" />
                <SquareBlock label="Tasks Completed" value={metrics.totalTasksCompleted} color="#000000" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between max-w-[1800px] w-full">
              <div className="w-full max-h-[400px]  hidden md:block md:w-2/3 rounded-lg border-black border-[3px] bg-[#FEFDF2] mb-4 md:mb-0">
                <LineChartTimeBlock averageTimeBlockEfficiency={metrics.averageTimeBlockEfficiency} />
              </div>
              <div className="w-full md:w-1/3 place-items-center max-w-[450px] flex md:flex-wrap justify-around md:gap-4">
                <SquareBlock label="Work Hours" value={metrics.categoryHours.work} color="#b82c05" />
                <SquareBlock label="Leisure Hours" value={metrics.categoryHours.leisure} color="#73926d" />
                <SquareBlock label="Social Hours" value={metrics.categoryHours.family_friends} color="#efbf7b" />
                <SquareBlock label="Atelic Hours" value={metrics.categoryHours.atelic} color="#a3bdb6" />
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default PlayerData;
