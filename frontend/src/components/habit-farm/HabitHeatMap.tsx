import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import './habits.css';

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
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDataIntoWeeks = (data: DataItem[]): FormattedData => {
    const weeks: any = [];
    const months = [];
    let currentWeek = new Array(7).fill(null).map(() => ({ completions: 0, date: '', isActive: false }));
    let currentWeekStartDate: any = null;
  
    let firstMonthDate = new Date(data[0].date + "T00:00:00Z"); // Treat as UTC
    let firstMonth = firstMonthDate.toLocaleString('default', { month: 'short' });
    let weekCount = 0;
  
    data.forEach((item, index) => {
      const date = new Date(item.date + "T00:00:00Z"); // Treat as UTC
      let dayIndex = date.getUTCDay();
  
      if (currentWeekStartDate === null) {
        currentWeekStartDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - dayIndex));
      }
  
      currentWeek[dayIndex] = { ...item, isActive: true };
  
      if (dayIndex === 6 || index === data.length - 1) {
        while (currentWeek[0] === null) {
          currentWeek.unshift({ completions: 0, date: '', isActive: false });
          currentWeek.pop();
        }
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null).map(() => ({ completions: 0, date: '', isActive: false }));
        currentWeekStartDate = null;
        weekCount++;
      }
    });
  
    if (weekCount > 0) {
      months.push({ month: firstMonth, count: weekCount, startWeek: 0 });
    }
  
    for (let i = 1; i <= 2; i++) {
      firstMonthDate.setUTCMonth(firstMonthDate.getUTCMonth() + 1);
      let nextMonth = firstMonthDate.toLocaleString('default', { month: 'short' });
      let startWeek = 0;
  
      for (let j = 0; j < weeks.length; j++) {
        const weekStartDate = new Date(weeks[j][0].date + "T00:00:00Z");
        if (weekStartDate.getUTCMonth() === firstMonthDate.getUTCMonth()) {
          startWeek = j;
          break;
        }
      }
  
      months.push({ month: nextMonth, count: weeks.length - startWeek, startWeek });
    }
  
    return { weeks, months };
};

// Interpolate between two colors based on the number of completions
const interpolateColor = (completions: number, maxCompletions: number) => {
    const percent = completions / maxCompletions;
    const startColor = { r: 254, g: 253, b: 242 }; // white
    const endColor = { r: 192, g: 212, b: 112 }; // green

    const r = Math.round(startColor.r + percent * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + percent * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + percent * (endColor.b - startColor.b));

    return `rgb(${r}, ${g}, ${b})`;
};

const HabitHeatmap = ({ data, cellSize = 15 }: HabitHeatmapProps) => {

    const { weeks, months } = formatDataIntoWeeks(data);
    
    const maxCompletions = Math.max(...data.map(item => item.completions), 1);

    return (
        <TooltipProvider>
            <div className="flex flex-col items-start gap-1">
                <div className="flex items-start ml-[30px]">
                    {months.map((month, index) => (
                        <div
                            key={index}
                            className="text-[13px] text-center"
                            style={{
                                position: 'relative',
                                left: `${month.startWeek * cellSize * 0.825}px`,
                            }}
                        >
                            {month.month}
                        </div>
                    ))}
                </div>
                {daysOfWeek.map((day, index) => (
                    <div key={day} className="flex items-center gap-1">
                        <div className='w-[15px] text-[13px] mr-[10px]'>{day}</div>
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
                                    <TooltipContent className='flex flex-col justify-center items-center'>
                                        <p>{new Date(dayData.date + "T00:00:00Z").toLocaleDateString() || 'No Data'}</p> {/* Convert UTC date to local date string */}
                                        <p>activity: {dayData.completions}</p>
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
