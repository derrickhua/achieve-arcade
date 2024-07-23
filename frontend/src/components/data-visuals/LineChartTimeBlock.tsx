import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';
import Image from 'next/image';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChartTimeBlock = ({ averageTimeBlockEfficiency }) => {
  const validatedEfficiencyData = averageTimeBlockEfficiency?.filter(item => item && item.date && item.efficiency != null) || [];

  if (validatedEfficiencyData.length === 0) {
    return (
      <div className="w-full bg-black rounded-sm p-4 md:p-6 h-full justify-center">
        <div className='w-full flex justify-center items-center h-2/3 gap-[100px]'>
          <Image src="/icons/no-data/dwarf-run.gif" alt="No Data Gif 1" 
          className='mt-[50px]' width={80} height={140} 
          style={{ imageRendering: 'pixelated' }}
          onContextMenu={(e) => e.preventDefault()}
          />
          <Image src="/icons/no-data/elf-run.gif" alt="No Data Gif 2" 
          className='mt-[50px]' width={80} height={140} 
          style={{ imageRendering: 'pixelated' }}
          onContextMenu={(e) => e.preventDefault()}
          />
          <Image src="/icons/no-data/knight-run.gif" alt="No Data Gif 3" 
          className='mt-[50px]' width={80} height={140} 
          style={{ imageRendering: 'pixelated' }}
          onContextMenu={(e) => e.preventDefault()}
          />

        </div>
        <div className="flex justify-center h-1/3 text-[#FEFDF2] text-[25px] md:text-[40px]">{`NO DATA AVAILABLE :(`}</div>
      </div>
    );
  }

  const lineChartData = [
    {
      name: 'Average Efficiency',
      data: validatedEfficiencyData.map(item => item.efficiency),
      color: '#27AE60' // Energetic Green
    }
  ];

  const startDate = validatedEfficiencyData[0].date;
  const endDate = validatedEfficiencyData[validatedEfficiencyData.length - 1].date;

  const formatXAxisLabels = (startDate, endDate) => {
    const diffInDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
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
    },
    xaxis: {
      categories: validatedEfficiencyData.map(item => item.date),
      labels: {
        style: {
          colors: '#000000', // Set x-axis labels color to #FEFDF2
        },
        formatter: (val) => {
          return new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
        }
      },
      type: 'category' // Ensure that the x-axis treats the values as categories
    },
    stroke: {
      curve: 'smooth',
      colors: ['#FEFDF2'] // Set stroke color to white
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    },
    yaxis: {
      title: {
        text: 'Efficiency (%)',
        style: {
          color: '#000000' // Set y-axis title color to #FEFDF2
        }
      },
      labels: {
        style: {
          colors: '#000000' // Set y-axis labels color to #FEFDF2
        },
        formatter: function (value) {
          return `${value.toFixed(2)}%`;
        }
      }
    }
  };
  

  const averageEfficiency = validatedEfficiencyData.reduce((total, item) => total + item.efficiency, 0) / validatedEfficiencyData.length;

  return (
    <div className="w-full bg-[#FEFDF2] rounded-sm p-4 md:p-6 h-full">
      <div className="flex justify-between mb-5">
        <h3 className="text-lg md:text-xl mb-2">Average Time Block Efficiency</h3>
        <div className="grid gap-4 grid-cols-1 text-right hidden md:grid">
          <div>
            <h5 className="inline-flex items-center leading-none font-normal mb-2">Average Efficiency</h5>
            <p className=" text-2xl leading-none">{averageEfficiency.toFixed(2)}%</p>
          </div>
        </div>
      </div>
      <div id="line-chart" className='h-[13vh] md:h-[270px] max-h-[270px]'>
        <ApexCharts options={lineChartOptions} series={lineChartData} type="line" height={'100%'} width={'100%'} />
      </div>
    </div>
  );
};

export default LineChartTimeBlock;
