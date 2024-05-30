import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChartComponent = ({ categoryHours, weeklyRequirements }) => {
  
  const data = [
    categoryHours.work || 0,
    categoryHours.leisure || 0,
    categoryHours.family_friends || 0,
    categoryHours.atelic || 0,
  ];

  const requiredHours = [
    weeklyRequirements.workHoursPerWeek,
    weeklyRequirements.leisureHoursPerWeek,
    weeklyRequirements.familyFriendsHoursPerWeek,
    weeklyRequirements.atelicHoursPerWeek,
  ];

  const labels = [
    'Work',
    'Leisure',
    'Family & Friends',
    'Atelic',
  ];

  const options = {
    labels,
    chart: {
      height:'100%',
      type: 'pie',
      width: '100%',
    },
    legend: {
      position: 'bottom',
      show: false,

    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const required = requiredHours[opts.seriesIndex];
          return `${val.toFixed(2)} hrs (required: ${required} hrs)`;
        },
      },
    },
  };

  return (
    <div className="max-w-sm w-full h-full flex flex-col justify-center items-center bg-white rounded-lg shadow dark:bg-gray-800 p-3 " >
      <div className="h-full w-full flex items-center justify-center min-w-[150px]" id="pie-chart">
        <ReactApexChart options={options} series={data} type="pie" height={'100%'} width={'100%'} />
      </div>
      <div className="text-[15px] ">
        Weekly Hours by Category
      </div>

    </div>
  );
};

export default PieChartComponent;
