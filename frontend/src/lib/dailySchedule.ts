import axios from 'axios';
import { getSession } from 'next-auth/react';

export interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

export interface TimeBlock {
  _id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  tasks: Task[];
  timerStartedAt?: Date;
  timerDuration?: number; // in seconds
  category: 'work' | 'leisure' | 'family_friends' | 'atelic'; // Category field
  completed: boolean; // For time blocks without tasks
}

export interface DailySchedule {
  _id: string;
  date: Date;
  userId: string;
  timeBlocks: TimeBlock[];
}

export interface TimeBlockUpdateData {
  name?: string;
  startTime?: Date;
  endTime?: Date;
  tasks?: Task[];
  category?: 'work' | 'leisure' | 'family_friends' | 'atelic'; // Category field
  completed?: boolean;
}

// Create an axios instance configured for your API base URL for daily schedules
const api = axios.create({
  baseURL: 'http://localhost:8000/api/daily-schedule',
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

// Fetch the daily schedule for the current date
export const getDailySchedule = async (): Promise<DailySchedule> => {
  return api.get('/').then(response => response.data);
};

// Add a new time block to the daily schedule
export const addTimeBlock = async (timeBlockData: Omit<TimeBlock, '_id'>): Promise<DailySchedule> => {
  try {
    const response = await api.post('/time-block', timeBlockData);
    console.log('Time block added successfully:', response.data);
    return response.data;  // Return only the response data containing the updated schedule
  } catch (error: any) {
    console.error('Error adding time block:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error for handling in the calling function
  }
};

// Update a specific time block within the daily schedule
export const updateTimeBlock = async (blockId: string, updateData: TimeBlockUpdateData): Promise<DailySchedule> => {
  return api.put(`/time-block/${blockId}`, updateData).then(response => response.data);
};

// Delete a specific time block from the daily schedule
export const deleteTimeBlock = async (blockId: string): Promise<void> => {
  return api.delete(`/time-block/${blockId}`).then(response => response.data);
};

// Start the timer for a specific time block
export const startTimer = async (blockId: string): Promise<DailySchedule> => {
  return api.post(`/time-block/${blockId}/start-timer`).then(response => response.data);
};

// Stop the timer for a specific time block and log the duration
export const stopTimer = async (blockId: string): Promise<DailySchedule> => {
  return api.post(`/time-block/${blockId}/stop-timer`).then(response => response.data);
};

// Retrieve the weekly metrics for the user
export const getWeeklyMetrics = async (): Promise<any> => {
  return api.get('/weekly-metrics').then(response => response.data);
};

// Retrieve the weekly hours spent in each category for the user
export const getWeeklyHours = async (date: string): Promise<any> => {
  return api.get(`/weekly-hours?date=${date}`).then(response => response.data);
};


