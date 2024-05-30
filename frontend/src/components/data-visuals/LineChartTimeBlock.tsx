'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChartTimeBlock = ({ averageTimeBlockEfficiency }) => {
  if (!averageTimeBlockEfficiency || !Array.isArray(averageTimeBlockEfficiency) || averageTimeBlockEfficiency.length === 0) {
    return <div>No data available</div>;
  }

  // Ensure each item in averageTimeBlockEfficiency has the required properties
  const validatedEfficiencyData = averageTimeBlockEfficiency.filter(item => item && item._id && item.averageEfficiency != null);

  if (validatedEfficiencyData.length === 0) {
    return <div>No valid data available</div>;
  }

  const lineChartData = [
    {
      name: 'Average Efficiency',
      data: validatedEfficiencyData.map(item => parseFloat(item.averageEfficiency.toFixed(2))) // Format to 2 decimal places
    }
  ];

  const startDate = new Date(validatedEfficiencyData[0]._id);
  const endDate = new Date(validatedEfficiencyData[validatedEfficiencyData.length - 1]._id);

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
      height: 270,
      width: '100%', // Set width to 100% to take full width of the container
      toolbar: {
        show: false // Disable the toolbar
      }
    },
    xaxis: {
      categories: validatedEfficiencyData.map(item => new Date(item._id).getTime()), // Use timestamps directly
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
      },
      y: {
        formatter: (val) => `${val}%`
      }
    },
    yaxis: {
      title: {
        text: 'Efficiency (%)'
      },
      labels: {
        formatter: function (value) {
          return `${value.toFixed(2)}%`; // Format the Y-axis labels to two decimal places
        }
      }
    }
  };

  const averageEfficiency = validatedEfficiencyData.reduce((total, item) => total + item.averageEfficiency, 0) / validatedEfficiencyData.length;

  return (
    <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div className="grid gap-4 grid-cols-1">
          <div>
            <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
              Average Efficiency
            </h5>
            <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
              {averageEfficiency.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      <div id="line-chart">
        <ApexCharts options={lineChartOptions} series={lineChartData} type="line" height={250} width={'100%'}/>
      </div>
    </div>
  );
};

export default LineChartTimeBlock;
