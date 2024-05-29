import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create an axios instance configured for your API base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/habits',
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

export const getHabits = async () => {
  return api.get('/');
};

export const addHabit = async (habitData) => {
  console.log('Sending habitData:', habitData);
  try {
    const response = await api.post('/', habitData);  
    return response;
  } catch (error) {
    console.error('Error adding habit:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Simplified API method to update habit completions for today
export const updateHabitCompletion = async (habitId, completionChange, date) => {
  try {
    const response = await api.post(`/${habitId}/update`, {
      completionChange,
      date
    });
    console.log('Response from updateHabitCompletion:', response.data);
    return response;
  } catch (error) {
    console.error('Error updating habit completion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// API method to update a habit
export const updateHabit = async (habitId, updateData) => {
  return api.put(`/${habitId}`, updateData);  
};

// API method to delete a habit
export const deleteHabit = async (habitId) => {
  return api.delete(`/${habitId}`);  
};
