import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create an axios instance configured for your API base URL for dashboard metrics
const api = axios.create({
  baseURL: 'http://localhost:8000/api/dashboard',
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

// Fetch the dashboard metrics
export const getDashboardMetrics = async (): Promise<any> => {
  try {
    const response = await api.get('/metrics');
    console.log(response)
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error.response ? error.response.data : error.message);
    throw error;
  }
};

