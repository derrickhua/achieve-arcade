import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/users',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to add the JWT token from NextAuth.js session
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  } else {
    console.log("No access token found in session.");
  }

  return config;
}, error => {
  console.error("Error in request interceptor:", error);
  return Promise.reject(error);
});

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/refresh-token`, {
      refreshToken
    });

    if (response.data.accessToken && response.data.accessTokenExpires) {
      console.log("Access token successfully refreshed:", response.data);
      return {
        accessToken: response.data.accessToken,
        accessTokenExpires: response.data.accessTokenExpires
      };
    } else {
      console.error("Invalid refresh token response:", response.data);
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    console.error('Error refreshing access token: ', error);
    return {
      accessToken: "",
      accessTokenExpires: 0,
      error: "RefreshAccessTokenError"
    };
  }
}

export async function getUser() {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function getUserPreferences() {
  try {
    console.log('Attempting to fetch user preferences');
    const response = await api.get('/profile/preferences');
    console.log('User preferences response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw new Error('Failed to fetch user preferences');
  }
}

export async function getUserCoins() {
  try {
    const response = await api.get('/coins');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    throw new Error('Failed to fetch user coins');
  }
}

export async function updateUser(updates) {
  try {
    console.log('Attempting to update user profile with updates:', updates);
    const response = await api.put('/update', updates);
    console.log('Update user profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

export async function deleteUser() {
  try {
    console.log('Attempting to delete user profile');
    const response = await api.delete('/delete');
    console.log('Delete user profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}

export async function getUserId() {
  try {
    console.log('Attempting to fetch user ID');
    const response = await api.get('/user-id');
    console.log('User ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw new Error('Failed to fetch user ID');
  }
}
