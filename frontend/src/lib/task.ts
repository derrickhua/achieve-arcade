import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create an axios instance configured for your API base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/tasks',
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

export const getTasks = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await api.post('/', taskData);
    return response.data; // Return only the response data containing the task
  } catch (error) {
    console.error('Error adding task:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || error.message || 'Error adding task'); // Re-throw the error with the proper message
  }
};

export const updateTask = async (taskId, updateData) => {
  return api.put(`/${taskId}`, updateData);
};

export const deleteTask = async (taskId) => {
  return api.delete(`/${taskId}`);
};
