import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';
import Image from 'next/image';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = ({ timeData }) => {
  const validatedTimeData = timeData?.filter(item => item && item.date && item.planned != null && item.realized != null) || [];

  if (validatedTimeData.length === 0) {
    return (
      <div className="w-full bg-black rounded-sm p-4 md:p-6 h-full justify-center">
        <div className='w-full flex justify-center items-center h-2/3 gap-[60px]'>
          <Image src="/icons/no-data/zombie-run.gif" alt="No Data Gif 2" 
          width={160} height={180} style={{ imageRendering: 'pixelated' }} 

          />
          <Image src="/icons/no-data/wizard-run.gif" alt="No Data Gif 1" 
          className='mt-[50px]' width={80} height={140} style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="flex justify-center h-1/3 text-center text-[#FEFDF2] text-[25px] md:text-[40px]">{`NO DATA AVAILABLE :(`}</div>
      </div>
    );
  }

  const lineChartData = [
    {
      name: 'Planned Time',
      data: validatedTimeData.map(item => item.planned),
      color: '#2D9CDB' // Arcade Blue
    },
    {
      name: 'Realized Time',
      data: validatedTimeData.map(item => item.realized),
      color: '#F2C94C' // Achievement Gold
    }
  ];

  const startDate = new Date(validatedTimeData[0].date);
  const endDate = new Date(validatedTimeData[validatedTimeData.length - 1].date);

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
      height: '100%',
      width: '100%',
      toolbar: {
        show: false
      },
      background: '#FEFDF2' // Set background color
    },
    xaxis: {
      categories: validatedTimeData.map(item => new Date(item.date).getTime()),
      labels: {
        formatter: (val) => {
          const date = new Date(val);
          return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
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
    },
    yaxis: {
      title: {
        text: 'Hours'
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(2);
        }
      }
    }
  };

  const totalPlannedTime = validatedTimeData.reduce((total, item) => total + (item.planned || 0), 0);
  const totalActualTime = validatedTimeData.reduce((total, item) => total + (item.realized || 0), 0);

  return (
    <div className="w-full bg-[#FEFDF2] rounded-sm p-4 md:p-6 h-full">
      <div className="flex justify-between mb-5">
        <h3 className="text-lg md:text-xl  mb-2">Planned Time vs Realized Time</h3>
        <div className="grid gap-4 grid-cols-2 text-right hidden md:grid ">
          <div>
            <h5 className="inline-flex items-center text-gray-500 leading-none font-normal mb-2">
              Planned Time
            </h5>
            <p className="text-gray-900 text-lg md:text-2xl leading-none">
              {totalPlannedTime.toFixed(0)} hours
            </p>
          </div>
          <div>
            <h5 className="inline-flex items-center text-gray-500 leading-none font-normal mb-2">
              Actual Time
            </h5>
            <p className="text-gray-900 text-lg md:text-2xl leading-none">
              {totalActualTime.toFixed(0)} hours
            </p>
          </div>
        </div>
      </div>
      <div id="line-chart" className='h-[13vh] md:h-[270px] max-h-[270px]'>
       <ApexCharts options={lineChartOptions} series={lineChartData} type="line" height="100%" width="100%"/>
    </div>

      
    </div>
  );
};

export default LineChart;
