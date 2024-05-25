// src/lib/dateTimeUtils.ts

export const timeOptions = [
    '12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM',
    '1:00 AM', '1:15 AM', '1:30 AM', '1:45 AM',
    '2:00 AM', '2:15 AM', '2:30 AM', '2:45 AM',
    '3:00 AM', '3:15 AM', '3:30 AM', '3:45 AM',
    '4:00 AM', '4:15 AM', '4:30 AM', '4:45 AM',
    '5:00 AM', '5:15 AM', '5:30 AM', '5:45 AM',
    '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM',
    '7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM',
    '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM',
    '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
    '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
    '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
    '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
    '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
    '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM',
    '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
    '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM',
    '8:00 PM', '8:15 PM', '8:30 PM', '8:45 PM',
    '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM',
    '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM',
    '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM',
  ];
  
  export const getClosestTimeSlot = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const closestMinutes = Math.round(minutes / 15) * 15;
    now.setMinutes(closestMinutes, 0, 0);
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${now.getMinutes().toString().padStart(2, '0')} ${ampm}`;
  
    return timeOptions.find(time => time === formattedTime) || timeOptions[0];
  };
  
  export const convertTo24HourFormat = (time: string) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours, 10);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };
  
  export const toUTCString = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    if (isNaN(date.getTime())) {
      throw new RangeError("Invalid time value");
    }
    return date.toISOString();
  };
  
  export const formatTimeForSelect = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  