import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/lib/dashboard';
import LineChart from '../data-visuals/LineChart';
import LineChartTimeBlock from '../data-visuals/LineChartTimeBlock';
import SquareBlock from '../layout/SquareBlock';

const PlayerData: React.FC = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Fetch data for the charts
    const fetchData = async () => {
      const data = await getDashboardMetrics();
      setMetrics(data);
      console.log(data)
    };

    fetchData();
  }, []);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 h-full overflow-auto flex flex-col items-center w-full">
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
          <SquareBlock label="Work Hours" value={metrics.categoryHours.work} color="#F36B5E" />
          <SquareBlock label="Leisure Hours" value={metrics.categoryHours.leisure} color="#4A90E2" />
          <SquareBlock label="Social Hours" value={metrics.categoryHours.family_friends} color="#F5ED83" />
          <SquareBlock label="Atelic Hours" value={metrics.categoryHours.atelic} color="#C0D470" />
        </div>
      </div>
    </div>
  );
};

export default PlayerData;
