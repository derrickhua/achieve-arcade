import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/suggestions',
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
 * Submits a suggestion with the provided details.
 * Throws an error if there is a problem with the submission.
 *
 * @param {Object} suggestion - An object containing the suggestion details.
 * @returns {Promise<Object>} The response from the server.
 * @throws {Error} If there is an issue with the API request.
 */
export async function submitSuggestion(suggestion: { subject: string, description: string }) {
  try {
    const response = await api.post('/', suggestion);
    return response.data;
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    throw new Error('Failed to submit suggestion');
  }
}
