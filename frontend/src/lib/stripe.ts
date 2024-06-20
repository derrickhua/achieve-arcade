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
 * @param {string} subscriptionId - The ID of the subscription to cancel.
 * @returns {Promise<Object>} The response from the backend API.
 * @throws {Error} If there is an issue with the API request.
 */
export async function cancelSubscription(subscriptionId) {
  try {
    const response = await api.post('/cancel-subscription', { subscriptionId });
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
/**
 * Creates a Stripe Checkout session on the backend.
 * 
 * @returns {Promise<string>} The session URL from the backend API.
 * @throws {Error} If there is an issue with the API request.
 */
export async function createCheckoutSession() {
  try {
    const userId = await getUserId(); // Retrieve the user ID
    const response = await api.post('/create-checkout-session', { userId }); // Send the user ID along with the request
    console.log(response.data);
    return response.data.url; // Adjust the response according to your backend response
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Retrieves the status of a Stripe Checkout session on the backend.
 * 
 * @param {string} sessionId - The ID of the session to retrieve the status for.
 * @returns {Promise<Object>} The response from the backend API, including the session status and customer email.
 * @throws {Error} If there is an issue with the API request.
 */
export async function getSessionStatus(sessionId) {
  try {
    const response = await api.get('/session-status', { params: { session_id: sessionId } });
    return response.data;
  } catch (error) {
    console.error('Error retrieving session status:', error);
    throw new Error('Failed to retrieve session status');
  }
}
