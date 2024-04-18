import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import './habits.css'

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

interface DataItem {
    date: string;
    completions: number;
    isActive?: boolean;  
}

interface WeekDayData {
    completions: number;
    date: string;
    isActive: boolean;
}

interface WeekData {
    [key: number]: WeekDayData;  
}

interface MonthData {
    month: string;
    count: number;  
    startWeek: number;
}

interface FormattedData {
    weeks: WeekData[];
    months: MonthData[];
}

interface DataItemZ {
    date: string;
    completions: number;
}

interface HabitHeatmapProps {
    data: DataItemZ[];
    cellSize?: number;
    maxCompletions?: number;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun']; 

const formatDataIntoWeeks = (data: DataItem[]): FormattedData => {
    const weeks:any = [];
    const months = [];
    let currentWeek = new Array(7).fill(null).map(() => ({ completions: 0, date: '', isActive: false }));
    let currentWeekStartDate:any = null;
  
    // Assuming 'data[0].date' is in 'YYYY-MM-DD' format, append a time to ensure it's treated as midday.
    let firstMonthDate = new Date(data[0].date + "T12:00:00");
    let firstMonth = firstMonthDate.toLocaleString('default', { month: 'short' });
    let weekCount = 0;
  
    data.forEach((item, index) => {
      const date = new Date(item.date);
      const dayIndex = date.getDay();
  
      if (!currentWeekStartDate) {
        currentWeekStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayIndex);
      }
  
      currentWeek[dayIndex] = { ...item, isActive: true };
  
      if (dayIndex === 6 || index === data.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null).map(() => ({ completions: 0, date: '', isActive: false }));
        currentWeekStartDate = null;
        weekCount++;
      }
    });
  
    if (weekCount > 0) {
      months.push({ month: firstMonth, count: weekCount, startWeek: 0 });
    }
  
    // Add the next two months
    for (let i = 1; i <= 2; i++) {
      firstMonthDate.setMonth(firstMonthDate.getMonth() + 1);
      let nextMonth = firstMonthDate.toLocaleString('default', { month: 'short' });
      let startWeek = 0;
  
      for (let j = 0; j < weeks.length; j++) {
        const weekStartDate = new Date(weeks[j][0].date + "T12:00:00");
        if (weekStartDate.getMonth() === firstMonthDate.getMonth()) {
          startWeek = j;
          break;
        }
      }
  
      months.push({ month: nextMonth, count: weeks.length - startWeek, startWeek });
    }

    return { weeks, months };
  };

// Interpolate between two colors based on the number of completions
const interpolateColor = (completions:number, maxCompletions:number) => {
    const percent = completions / maxCompletions;
    const startColor = { r: 300, g: 300, b: 300 }; // white
    const endColor = { r: 155, g: 233, b: 168  }; // green

    const r = Math.round(startColor.r + percent * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + percent * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + percent * (endColor.b - startColor.b));

    return `rgb(${r}, ${g}, ${b})`;
};

const HabitHeatmap = ({ data, cellSize = 15, maxCompletions = 10 }: HabitHeatmapProps) => {
    const { weeks, months } = formatDataIntoWeeks(data);
    return (
        <TooltipProvider>
            <div className="flex flex-col items-start gap-1">
                <div className="flex items-start ml-[30px]">
                {months.map((month, index) => (
                    <div
                    key={index}
                    className="text-[12px] text-center"
                    style={{
                        position: 'relative',
                        left: `${month.startWeek * cellSize*0.825}px`,
                    }}
                    >
                    {month.month}
                    </div>
                ))}
                </div>
                {daysOfWeek.map((day, index) => (
                    <div key={day} className="flex items-center gap-1">
                        <div className='w-[15px] text-[10px] mr-[10px]'>{day}</div>
                        {weeks.map((week, wIndex) => {
                            const dayData = week[index];
                            const backgroundColor = dayData.isActive ? interpolateColor(dayData.completions, maxCompletions) : 'white';
                            const borderColor = dayData.isActive ? '#ddd' : '#ddd';
                            return (
                                <Tooltip key={`${day}-${wIndex}`}>
                                    <TooltipTrigger>
                                        <div
                                            className='rounded-[3px] p-[1px] cell'
                                            style={{
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                                backgroundColor,
                                                border: `1px solid ${borderColor}`,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{dayData.date || 'No Data'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                ))}
            </div>
        </TooltipProvider>
    );
};

export default HabitHeatmap;