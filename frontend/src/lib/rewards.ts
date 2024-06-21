import axios from 'axios';
import { getSession } from 'next-auth/react';

interface IReward {
    _id?: string;
    name: string;
    icon?: string;
    chestType: "Wood" | "Metal" | "Gold";
}

// Create an axios instance configured for your API base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/rewards',
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

// Get all rewards for the logged-in user
export const getAllRewards = async (): Promise<IReward[]> => {
  const response = await api.get('/');
  return response.data;
};

// Create a new reward for the logged-in user
export const createReward = async (rewardData: IReward): Promise<IReward> => {
  try {
    const response = await api.post('/', rewardData);
    return response.data;
  } catch (error) {
    console.error('Error creating reward:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Get a specific reward for the logged-in user
export const getReward = async (rewardId: string): Promise<IReward> => {
  const response = await api.get(`/${rewardId}`);
  return response.data;
};

// Update a reward for the logged-in user
export const updateReward = async (rewardId: string, updateData: Partial<IReward>): Promise<IReward> => {
  const response = await api.put(`/${rewardId}`, updateData);
  return response.data;
};

// Delete a reward for the logged-in user
export const deleteReward = async (rewardId: string): Promise<void> => {
  await api.delete(`/${rewardId}`);
};

// Purchase a chest for the logged-in user
export const purchaseChest = async (chestType: "Wood" | "Metal" | "Gold"): Promise<IReward | { message: string }> => {
  try {
    const response = await api.post('/purchase-chest', { chestType });
    return response.data;
  } catch (error) {
    console.error('Error purchasing chest:', error.response ? error.response.data : error.message);
    throw error;
  }
};
