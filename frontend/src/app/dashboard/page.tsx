'use client';
import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/lib/dashboard';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';
import GaugeChart from 'react-gauge-chart';
import HabitStreaks from '@/components/data-visuals/HabitStreaks';
import ProgressBar from '@/components/data-visuals/ProgressBar';

const LineChart = dynamic(() => import('@/components/data-visuals/LineChart'), { ssr: false });
const PieChartComponent = dynamic(() => import('@/components/data-visuals/PieChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/data-visuals/BarChart'), { ssr: false });
const LineChartTimeBlock = dynamic(() => import('@/components/data-visuals/LineChartTimeBlock'), { ssr: false });
const RadialChart = dynamic(() => import('@/components/data-visuals/RadialChart'), { ssr: false });
const ScheduleCompletionRate = dynamic(() => import('@/components/data-visuals/ScheduleCompletionRate'), { ssr: false });
const CustomRadialChart = dynamic(() => import('@/components/data-visuals/CustomRadial'), { ssr: false });

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
    averageTimeBlockEfficiency = [],
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
    <div className="h-full">
      <div className="max-w-7xl mx-auto gap-2 grid grid-cols-4" style={{ gridTemplateRows: 'repeat(4, 20vh)', gridTemplateColumns: 'repeat(4, 20vh)' }}>
        {timeData && timeData.length > 0 && (
          <div className="col-span-3 row-span-2 h-full flex items-center justify-center w-full">
            <div className="w-full h-full flex justify-center items-center">
              <LineChart timeData={timeData} />
            </div>
          </div>
        )}
        <div className="col-span-1 row-span-1">
          <div className="flex flex-col items-center justify-center h-full w-full aspect-square rounded-lg p-2">
            <ScheduleCompletionRate completionRate={scheduleCompletionRate} />
          </div>
        </div>
        <div className="col-span-1 row-span-1">
          <div className="flex flex-col items-center justify-center h-full w-full aspect-square bg-white rounded-lg p-2">
            <PieChartComponent categoryHours={categoryHours} weeklyRequirements={weeklyRequirements} />
          </div>
        </div>
        <div className="col-span-1 row-span-1">
          <div className="flex flex-col items-center justify-center h-full w-full aspect-square rounded-lg p-2">
            <CustomRadialChart percentage={goalProgress.toFixed(0)} label="Goal Progress" />
          </div>
        </div>
        <div className="col-span-1 row-span-1">
          <div className="flex flex-col items-center justify-center h-full w-full aspect-square rounded-lg p-2">
            <CustomRadialChart percentage={milestoneCompletionRate.toFixed(0)} label="Milestone Completion" />
          </div>
        </div>
        <div className="col-span-2 row-span-2">
          <div className="w-full h-full">
            <LineChartTimeBlock averageTimeBlockEfficiency={averageTimeBlockEfficiency} />
          </div>
        </div>
        <div className="col-span-1 row-span-1">
          <div className="flex flex-col items-center justify-center h-full w-full aspect-square rounded-lg p-2">
            <HabitStreaks streaks={activeStreaks} />
          </div>
        </div>
        <div className="col-span-1 row-span-1">
          <div className="flex flex-col items-center justify-center h-full w-full aspect-square rounded-lg p-2">
            <RadialChart consistencyRate={habitConsistencyRate} />
          </div>
        </div>
      </div>
    </div>
  );
}
