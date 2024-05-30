import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';
import { ApexOptions } from 'apexcharts';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CustomRadialChartProps {
  percentage: number;
  label: string;
}

const CustomRadialChart: React.FC<CustomRadialChartProps> = ({ percentage, label }) => {
  const options: ApexOptions = {
    series: [percentage],
    chart: {
      height: '100%',
      type: 'radialBar',
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
            formatter: function (val) {
              return `${parseInt(val.toString())}%`;
            },
            color: '#FFFFFF', // Number color as white
            fontSize: '36px',
            show: true,
          },
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
    <div className="flex flex-col items-center justify-center h-full w-full aspect-square bg-[#3498DB] rounded-lg p-4 shadow-lg">
      <div id="chart" className="flex-grow flex items-center justify-center w-full h-full">
        <ApexCharts options={options} series={options.series as number[]} type="radialBar" height={'100%'} width="100%" />
      </div>
      <div className="text-[15px] text-white mt-2">
        {label}
      </div>
    </div>
  );
};

export default CustomRadialChart;
