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
    console.log("Fetching session for the request...");
    const session = await getSession();
    console.log("Session obtained:", session);

    if (session?.accessToken) {
        console.log("Adding access token to headers...");
        config.headers.Authorization = `Bearer ${session.accessToken}`;
        console.log("Headers after adding token:", config.headers);
    } else {
        console.log("No access token found in session.");
    }

    return config;
}, error => {
    console.log("Error in request interceptor:", error);
    return Promise.reject(error);
});

export const getHabits = async () => {
  return api.get('/');
};

export const addHabit = async (habitData) => {
    console.log('Sending habitData:', habitData);
    try {
        const response = await api.post('/add', habitData);
        console.log('Response from addHabit:', response.data);
        return response;
    } catch (error) {
        console.error('Error adding habit:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// API method to complete a habit
export const completeHabit = async (habitId) => {
  return api.post(`/${habitId}/complete`);
};

// API method to update a habit
export const updateHabit = async (habitId, updateData) => {
  return api.put(`/update/${habitId}`, updateData);
};

// API method to delete a habit
export const deleteHabit = async (habitId) => {
  return api.delete(`/delete/${habitId}`);
};

