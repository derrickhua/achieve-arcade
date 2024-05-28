'use client'
import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/lib/dashboard';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('somethings happening')
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        console.log(data)
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

  const { timeData, taskCompletionRate, scheduleCompletionRate, averageTimeBlockEfficiency, goalProgress, milestoneCompletionRate, activeStreaks, habitAdherenceRate } = metrics;

  const lineChartData = {
    labels: timeData.map(item => new Date(item._id).toLocaleDateString()),
    datasets: [
      {
        label: 'Planned Time',
        data: timeData.map(item => item.planned),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Actual Time',
        data: timeData.map(item => item.actual),
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
      }
    ]
  };

  return (
    <div className="p-4">
      <BentoGrid>
        <BentoGridItem title="Task Completion Rate" description={`${taskCompletionRate.toFixed(2)}%`} />
        <BentoGridItem title="Schedule Completion Rate" description={`${scheduleCompletionRate.toFixed(2)}%`} />
        <BentoGridItem title="Average Time Block Efficiency" description={`${averageTimeBlockEfficiency.toFixed(2)}%`} />
        <BentoGridItem title="Goal Progress" description={`${goalProgress.toFixed(2)}%`} />
        <BentoGridItem title="Milestone Completion Rate" description={`${milestoneCompletionRate.toFixed(2)}%`} />
        <BentoGridItem title="Active Habit Streaks" description={activeStreaks} />
        <BentoGridItem title="Habit Adherence Rate" description={`${habitAdherenceRate.toFixed(2)}%`} />
        <BentoGridItem title="Total Time Spent vs Planned Time" header={<Line data={lineChartData} />} />
      </BentoGrid>
    </div>
  );
};
