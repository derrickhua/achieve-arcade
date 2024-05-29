'use client';
import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/lib/dashboard';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';
import GaugeChart from 'react-gauge-chart';

const LineChart = dynamic(() => import('@/components/data-visuals/LineChart'), { ssr: false });
const PieChartComponent = dynamic(() => import('@/components/data-visuals/PieChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/data-visuals/BarChart'), { ssr: false });

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching dashboard metrics...');
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        console.log(data);
        setMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metrics) {
    return <div>No data available</div>;
  }

  const {
    timeData = [],
    scheduleCompletionRate = 0,
    averageTimeBlockEfficiency = 0,
    goalProgress = 0,
    milestoneCompletionRate = 0,
    activeStreaks = 0,
    habitConsistencyRate = 0,
    categoryHours = {
      work: 0,
      leisure: 0,
      family_friends: 0,
      atelic: 0,
    },
    weeklyRequirements = {
      workHoursPerWeek: 0,
      leisureHoursPerWeek: 0,
      familyFriendsHoursPerWeek: 0,
      atelicHoursPerWeek: 0,
    }
  } = metrics;

  const barChartData = [
    { category: 'Work', value: categoryHours.work },
    { category: 'Leisure', value: categoryHours.leisure },
    { category: 'Family & Friends', value: categoryHours.family_friends },
    { category: 'Atelic', value: categoryHours.atelic },
  ];

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-5 gap-4 auto-rows-[minmax(100px, auto)]">
        {timeData && timeData.length > 0 && (
          <div className="col-span-4 row-span-2">
            <BentoGridItem 
              title="Total Time Spent vs Planned Time"
              header={<LineChart timeData={timeData} />}
            />
          </div>
        )}
        <div className="col-span-1">
          <BentoGridItem 
            className='h-[200px] flex'
            title="Schedule Completion Rate"
            header={<GaugeChart id="scheduleCompletionRate" percent={scheduleCompletionRate / 100} />}
          />
        </div>
        <div className="col-span-1">
          <BentoGridItem className='' title="Weekly Hours by Category" header={<PieChartComponent categoryHours={categoryHours} weeklyRequirements={weeklyRequirements} />} />
        </div>
        <div className="col-span-1">
          <BentoGridItem title="Average Time Block Efficiency" header={<BarChart barChartData={barChartData} />} />
        </div>
        {/* <div className="col-span-1 h-[200px]">
          <BentoGridItem 
            className='h-[200px]'
            title="Goal Progress"
            header={<ProgressBar percentage={goalProgress.toFixed(2)} />}
          />
        </div>
        <div className="col-span-1">
          <BentoGridItem 
            className='h-[200px]'
            title="Milestone Completion Rate"
            header={<ProgressBar percentage={milestoneCompletionRate.toFixed(2)} />}
          />
        </div>
        <div className="col-span-1">
          <BentoGridItem 
            className='h-[200px]'
            title="Active Habit Streaks" 
            header={<HabitStreaks streaks={activeStreaks} />} />
        </div>
        <div className="col-span-1">
          <BentoGridItem 
            className='h-[200px]' 
            title="Habit Consistency Rate" 
            header={<Bar data={habitConsistencyData} />} />
        </div> */}
      </div>
    </div>
  );
};
