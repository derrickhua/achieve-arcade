import express from 'express';
import {
  createCheckoutSession,
  getSessionStatus,
  cancelSubscription,
  refundAllPayments,
  handleStripeWebhook,
} from '../controllers/stripe.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Stripe routes
router.post('/create-checkout-session', createCheckoutSession);
router.get('/session-status', getSessionStatus);
router.post('/cancel-subscription', cancelSubscription);
router.post('/refund-all-payments', refundAllPayments);

// Webhook route
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
