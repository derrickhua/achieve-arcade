import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create an axios instance configured for your API base URL for habits
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/habits`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to add the JWT token from NextAuth.js session
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.authorization = `Bearer ${session.accessToken}`;
  } else {
    console.log("No access token found in session.");
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Fetch all habits
export const getHabits = async () => {
  try {
    const response = await api.get('/');
    console.log('Fetched habits:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching habits:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Add a new habit
export const addHabit = async (habitData) => {
  try {
    const response = await api.post('/', habitData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { data } = error.response;
      console.error('Error adding habit:', data.message);
      throw new Error(data.message || 'An error occurred while adding the habit');
    } else {
      console.error('Error adding habit:', error.message);
      throw new Error(error.message || 'An error occurred while adding the habit');
    }
  }
};

// API method to update habit completions for today
export const updateHabitCompletion = async (habitId, newCount) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    console.log('date today:', date)
    const response = await api.post(`/${habitId}/update`, {
      completionChange: newCount,
      date
    });
    console.log('Habit updated:', response.data);
    return response.data; // Ensure the updated habit data is returned
  } catch (error) {
    console.error('Error updating habit completion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// API method to update a habit
export const updateHabit = async (habitId, updateData) => {
  return api.put(`/${habitId}`, updateData).then(response => response.data);  
};

// API method to delete a habit
export const deleteHabit = async (habitId) => {
  return api.delete(`/${habitId}`).then(response => response.data);  
};
