import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RadialChartProps {
  consistencyRate: number;
}

const RadialChart: React.FC<RadialChartProps> = ({ consistencyRate }) => {
  const options = {
    series: [consistencyRate],
    chart: {
      height: '100%',
      type: 'radialBar',
      width:'100%'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            formatter: function (val: number) {
                return `${parseInt(val.toString())}%`;
              },
            color: '#FFFFFF', // Number color as white
            fontSize: '36px',
            show: true,
          }
        },
      },
    },
    fill: {
      colors: ['#FFFFFF'], // Filled color as white
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [],
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full aspect-square bg-green-300 rounded-lg p-4 shadow-lg">
      <div id="chart" className="flex-grow flex items-center justify-center">
        <ApexCharts options={options} series={options.series} type="radialBar" height={'100%'} width={'100%'}/>
      </div>
      <div className="text-[15px] text-white">
        Habit Consistency Rate
      </div>
    </div>
  );
};

export default RadialChart;
