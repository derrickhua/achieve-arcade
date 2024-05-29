'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = ({ timeData }) => {
  if (!timeData || !Array.isArray(timeData) || timeData.length === 0) {
    return <div>No data available</div>;
  }

  // Ensure each item in timeData has the required properties
  const validatedTimeData = timeData.filter(item => item && item._id && item.planned != null && item.actual != null);

  if (validatedTimeData.length === 0) {
    return <div>No valid data available</div>;
  }

  console.log("Validated Time Data:", validatedTimeData);

  const lineChartData = [
    {
      name: 'Planned Time',
      data: validatedTimeData.map(item => parseFloat((item.planned / 3600).toFixed(2))) // Convert from seconds to hours and format to 2 decimal places
    },
    {
      name: 'Actual Time',
      data: validatedTimeData.map(item => parseFloat((item.actual / 3600).toFixed(2))) // Convert from seconds to hours and format to 2 decimal places
    }
  ];

  const startDate = new Date(validatedTimeData[0]._id);
  const endDate = new Date(validatedTimeData[validatedTimeData.length - 1]._id);

  const formatXAxisLabels = (startDate, endDate) => {
    const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (diffInDays > 30) {
      return 'MMM yyyy'; // For data spanning more than a month, use "month year"
    }
    return 'dd MMM yyyy'; // For data spanning less than a month, use "day month year"
  };

  const xAxisLabelFormat = formatXAxisLabels(startDate, endDate);

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      width: '100%', // Set width to 100% to take full width of the container
      toolbar: {
        show: false // Disable the toolbar
      }
    },
    xaxis: {
      categories: validatedTimeData.map(item => new Date(item._id).getTime()), // Use timestamps directly
      labels: {
        formatter: (val) => {
          const date = new Date(val);
          return date.toLocaleDateString('en-GB', xAxisLabelFormat === 'dd MMM yyyy' ? { day: '2-digit', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });
        }
      }
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        formatter: (val) => {
          const date = new Date(val);
          return date.toLocaleDateString('en-GB', xAxisLabelFormat === 'dd MMM yyyy' ? { day: '2-digit', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });
        }
      }
    },
    yaxis: {
      title: {
        text: 'Hours'
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(2); // Format the Y-axis labels to two decimal places
        }
      }
    }
  };

  const totalPlannedTime = validatedTimeData.reduce((total, item) => total + (item.planned || 0), 0) / 3600;
  const totalActualTime = validatedTimeData.reduce((total, item) => total + (item.actual || 0), 0) / 3600;

  return (
    <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
              Planned Time
            </h5>
            <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
              {totalPlannedTime.toFixed(0)} hours
            </p>
          </div>
          <div>
            <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
              Actual Time
            </h5>
            <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
              {totalActualTime.toFixed(0)} hours
            </p>
          </div>
        </div>
      </div>
      <div id="line-chart">
        <ApexCharts options={lineChartOptions} series={lineChartData} type="line" height={350} width={'100%'}/>
      </div>
    </div>
  );
};

export default LineChart;
