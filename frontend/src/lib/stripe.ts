import axios from 'axios';
import { getSession } from 'next-auth/react';
import { getUserId } from './user';
const api = axios.create({
  baseURL: 'http://localhost:8000/api/stripe',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to add the JWT token from NextAuth.js session
api.interceptors.request.use(async (config) => {
  const session:any = await getSession();
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
      currency: 'usd',
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
    const response = await api.post('/cancel-subscription');
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
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
