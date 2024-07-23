import axios from 'axios';
import { getSession } from 'next-auth/react';

export interface Task {
  _id: string;
  name: string;
  completed: boolean;
  difficulty?: string;
}

export interface TimeBlock {
  _id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  tasks: Task[];
  category: 'work' | 'leisure' | 'family_friends' | 'atelic'; // Category field
  completed: boolean; // For time blocks without tasks
}

export interface DailySchedule {
  _id: string;
  date: Date;
  userId: string;
  timeBlocks: TimeBlock[];
  notes: string; // Added notes field
}

export interface TimeBlockUpdateData {
  name?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  tasks?: Task[];
  category?: 'work' | 'leisure' | 'family_friends' | 'atelic';
  completed?: boolean;
}

// Create an axios instance configured for your API base URL for daily schedules
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/daily-schedule',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to add the JWT token from NextAuth.js session
api.interceptors.request.use(async (config) => {
  const session: any = await getSession();
  if (session?.accessToken) {
    config.headers.authorization = `Bearer ${session.accessToken}`;
  } else {
    console.log("No access token found in session.");
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Helper function to get the user's local date in ISO format
const getLocalDate = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split('T')[0];
};

// Helper function to get the user's local date in ISO format and timezone
const getLocalDateAndTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight local time
  const formattedDate = today.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
  return { formattedDate, timezone };
};

// Fetch the daily schedule for the current date
export const getDailySchedule = async (timezone: string): Promise<DailySchedule> => {
  const { formattedDate } = getLocalDateAndTimezone();
  return api.get(`/daily`, {
    params: { date: formattedDate, timezone }
  }).then(response => response.data);
};

// Add a new time block to the daily schedule
export const addTimeBlock = async (timeBlockData: Omit<TimeBlock, '_id'>): Promise<DailySchedule> => {
  try {
    // Get the user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await api.post('/timeBlock', { ...timeBlockData, timezone });
    return response.data;  // Return only the response data containing the updated schedule
  } catch (error: any) {
    console.error('Error adding time block:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error for handling in the calling function
  }
};

// Update a specific time block within the daily schedule
export const updateTimeBlock = async (blockId: string, updateData: TimeBlockUpdateData): Promise<DailySchedule> => {
  try {
    const response = await api.put(`/timeBlock/${blockId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update time block:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteTimeBlock = async (blockId: string): Promise<void> => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return api.delete(`/timeBlock/${blockId}`, { data: { timezone } }).then(response => response.data);
};

// Retrieve the weekly metrics for the user
export const getWeeklyMetrics = async (date: string, timezone: string): Promise<any> => {
  return api.get(`/weeklyMetrics`, {
    params: { date, timezone }
  }).then(response => response.data);
};

export const updateNotes = async (notes: string): Promise<DailySchedule> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await api.put('/notes', { notes, timezone });
    return response.data;  // Return only the response data containing the updated schedule
  } catch (error: any) {
    console.error('Error updating notes:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error for handling in the calling function
  }
};
