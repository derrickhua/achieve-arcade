import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/stripe',
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
 * Creates a payment intent on the backend.
 * 
 * @param {number} amount - The amount to charge in cents.
 * @param {string} paymentMethodId - The payment method ID from Stripe.
 * @param {string} email - The email of the user making the payment.
 * @returns {Promise<Object>} The response from the backend API.
 * @throws {Error} If there is an issue with the API request.
 */
export async function createPayment(amount, paymentMethodId, email) {
  try {
    const response = await api.post('/create-payment', {
      amount,
      currency: 'cad',
      paymentMethodId,
      email,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
}

/**
 * Cancels a subscription on the backend.
 * 
 * @returns {Promise<Object>} The response from the backend API.
 * @throws {Error} If there is an issue with the API request.
 */
export async function cancelSubscription() {
  try {
    const response = await api.post('/cancel-subscription'); // Use api instance instead of axios
    console.log('Subscription canceled:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Refunds all payments for a user on the backend.
 * 
 * @returns {Promise<Object>} The response from the backend API.
 * @throws {Error} If there is an issue with the API request.
 */
export async function refundAllPayments() {
  try {
    const response = await api.post('/refund-all-payments');
    return response.data;
  } catch (error) {
    console.error('Error refunding payments:', error);
    throw new Error('Failed to refund payments');
  }
}
