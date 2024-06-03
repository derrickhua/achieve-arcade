import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/users',
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

/**
 * Attempts to refresh the access token using a refresh token that is passed as an argument.
 * This function sends the refresh token to the server endpoint, which manages the token securely
 * and only requires a simple POST request with the refresh token to initiate a token refresh.
 * 
 * @param {string} refreshToken - The refresh token needed to request a new access token.
 * @returns {Promise<{accessToken: string, accessTokenExpires: number, error?: string}>}
 *          Returns a promise that resolves with the new access token and its expiration time, or an error if something goes wrong.
 */
export async function refreshAccessToken(refreshToken) {
  try {
    // Make a POST request to the refresh token endpoint, including the refresh token in the request body
    const response = await axios.post('http://localhost:8000/api/users/refresh-token', {
      refreshToken  // Sending refreshToken in the body
    });

    // Check if the response includes the necessary data
    console.log(response.data)
    if (response.data.accessToken && response.data.accessTokenExpires) {
      return {
        accessToken: response.data.accessToken,
        accessTokenExpires: response.data.accessTokenExpires  // Use directly from the response
      };
    } else {
      // Handle any cases where the expected data isn't returned
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    console.error('Error refreshing access token: ', error);

    // Return an object indicating an error has occurred, ensuring to maintain the shape of the expected return type
    return {
      accessToken: "",
      accessTokenExpires: 0,
      error: "RefreshAccessTokenError"
    };
  }
}

/**
 * Retrieves the user's profile information including username, email, and preferences.
 * Throws an error if there is a problem fetching the user from the database.
 *
 * @returns {Promise<Object>} The user's profile data.
 * @throws {Error} If there is an issue with the API request.
 */
export async function getUser() {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Retrieves the user's preferences.
 * Throws an error if there is a problem fetching the preferences from the database.
 *
 * @returns {Promise<Object>} The user's preferences.
 * @throws {Error} If there is an issue with the API request.
 */
export async function getUserPreferences() {
  try {
    const response = await api.get('/profile/preferences');
    return response.data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw new Error('Failed to fetch user preferences');
  }
}

/**
 * Retrieves the user's coins.
 * Throws an error if there is a problem fetching the coins from the database.
 *
 * @returns {Promise<Number>} The user's coins.
 * @throws {Error} If there is an issue with the API request.
 */
export async function getUserCoins() {
  try {
    const response = await api.get('/coins');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    throw new Error('Failed to fetch user coins');
  }
}

/**
 * Updates the user's profile including username, email, password, and preferences.
 * Throws an error if there is a problem updating the user in the database.
 *
 * @param {Object} updates - An object containing the updates to be made.
 * @returns {Promise<Object>} The updated user profile data.
 * @throws {Error} If there is an issue with the API request.
 */
export async function updateUser(updates) {
  try {
    const response = await api.put('/update', updates);  // No userId needed here
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Deletes the user profile.
 * Throws an error if there is a problem deleting the user from the database.
 *
 * @returns {Promise<Object>} The response from the server.
 * @throws {Error} If there is an issue with the API request.
 */
export async function deleteUser() {
  try {
    const response = await api.delete('/delete');
    return response.data;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}
