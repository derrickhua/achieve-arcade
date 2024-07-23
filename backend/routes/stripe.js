import express from 'express';
import {
  createCheckoutSession,
  cancelSubscription,
  refundAllPayments,
  handleStripeWebhook,
} from '../controllers/stripe.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Stripe routes
router.post('/create-checkout-session', createCheckoutSession);
router.post('/cancel-subscription', authenticate, cancelSubscription); // Ensure this line is correct
router.post('/refund-all-payments', refundAllPayments);

// Webhook route
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
