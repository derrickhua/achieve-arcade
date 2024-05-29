'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ barChartData }) => {
  if (!barChartData || !Array.isArray(barChartData) || barChartData.length === 0) {
    return <div>No data available</div>;
  }

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: barChartData.map(item => item.category),
      
    },
    yaxis: {
      title: {
        text: 'Values',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (value) {
            return value.toFixed(2); // Format the Y-axis labels to two decimal places
        }
      },
    },
  };

  const chartSeries = [
    {
      name: 'Values',
      data: barChartData.map(item => item.value),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div id="bar-chart">
        <ApexCharts options={chartOptions} series={chartSeries} type="bar" height={350} width="100%" />
      </div>
    </div>
  );
};

export default BarChart;
