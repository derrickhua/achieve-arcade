import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChartComponent = ({ categoryHours, weeklyRequirements }) => {
  console.log(categoryHours, weeklyRequirements);
  
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
      type: 'pie',
      width: '100%',
    },
    legend: {
      position: 'bottom',
      fontSize: '12px'  // Adjust font size here
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
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6" >
      <div className="py-4" id="pie-chart">
        <ReactApexChart options={options} series={data} type="pie" height={250} />
      </div>
    </div>
  );
};

export default PieChartComponent;
