'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChartTimeBlock = ({ averageTimeBlockEfficiency }) => {
  if (!averageTimeBlockEfficiency || !Array.isArray(averageTimeBlockEfficiency) || averageTimeBlockEfficiency.length === 0) {
    return <div>No data available</div>;
  }

  const validatedEfficiencyData = averageTimeBlockEfficiency.filter(item => item && item.date && item.efficiency != null);

  if (validatedEfficiencyData.length === 0) {
    return <div>No valid data available</div>;
  }

  const lineChartData = [
    {
      name: 'Average Efficiency',
      data: validatedEfficiencyData.map(item => item.efficiency),
      color: '#27AE60' // Energetic Green
    }
  ];

  const startDate = new Date(validatedEfficiencyData[0].date);
  const endDate = new Date(validatedEfficiencyData[validatedEfficiencyData.length - 1].date);

  const formatXAxisLabels = (startDate, endDate) => {
    const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (diffInDays > 30) {
      return 'MMM yyyy';
    }
    return 'dd MMM yyyy';
  };

  const xAxisLabelFormat = formatXAxisLabels(startDate, endDate);

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 270,
      width: '100%',
      toolbar: {
        show: false
      },
      background: '#FEFDF2' // Set background color
    },
    xaxis: {
      categories: validatedEfficiencyData.map(item => new Date(item.date).getTime()),
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
          return `${value.toFixed(2)}%`;
        }
      }
    }
  };

  const averageEfficiency = validatedEfficiencyData.reduce((total, item) => total + item.efficiency, 0) / validatedEfficiencyData.length;

  return (
    <div className="w-full bg-[#FEFDF2] rounded-lg p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <h3 className="text-xl mb-2">Average Time Block Efficiency</h3>
        <div className="grid gap-4 grid-cols-1 text-right">
          <div>
            <h5 className="inline-flex items-center text-gray-500 leading-none font-normal mb-2">
              Average Efficiency
            </h5>
            <p className="text-gray-900 text-2xl leading-none">
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
