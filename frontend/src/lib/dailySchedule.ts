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

// Fetch the daily schedule for the current date
export const getDailySchedule = async (): Promise<DailySchedule> => {
  return api.get('/daily').then(response => response.data);
};

// Add a new time block to the daily schedule
export const addTimeBlock = async (timeBlockData: Omit<TimeBlock, '_id'>): Promise<DailySchedule> => {
  try {
    const response = await api.post('/timeBlock', timeBlockData);
    return response.data;  // Return only the response data containing the updated schedule
  } catch (error: any) {
    console.error('Error adding time block:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error for handling in the calling function
  }
};

// Update a specific time block within the daily schedule
export const updateTimeBlock = async (blockId: string, updateData: TimeBlockUpdateData): Promise<DailySchedule> => {
  return api.put(`/timeBlock/${blockId}`, updateData).then(response => response.data);
};

// Delete a specific time block from the daily schedule
export const deleteTimeBlock = async (blockId: string): Promise<void> => {
  return api.delete(`/timeBlock/${blockId}`).then(response => response.data);
};

// Retrieve the weekly metrics for the user
export const getWeeklyMetrics = async (date: string): Promise<any> => {
  return api.get(`/weeklyMetrics?date=${date}`).then(response => response.data);
};

// Update the notes for the daily schedule
export const updateNotes = async (notes: string): Promise<DailySchedule> => {
  try {
    // Ensure notes is a string
    if (typeof notes !== 'string') {
      throw new Error('Notes must be a string');
    }

    const response = await api.put('/notes', { notes });
    return response.data;  // Return only the response data containing the updated schedule
  } catch (error: any) {
    console.error('Error updating notes:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error for handling in the calling function
  }
};
