import Stripe from 'stripe';
import User from '../models/user.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = 'http://localhost:3000';

export const createCheckoutSession = async (req, res) => {
    const { userId } = req.body; // Retrieve the user ID from the request body
  
    try {
      const priceId = 'price_1PTRT6P21qukNQhzpzmYWp5T'; // Replace with your actual Price ID
  
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${YOUR_DOMAIN}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/dashboard?canceled=true`,
        automatic_tax: { enabled: true },
        metadata: {
          userId: userId, // Attach the user ID to the metadata
        },
      });
  
      res.redirect(303, session.url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  };

export const getSessionStatus = async (req, res) => {
    try {
        console.log('Received request to get session status for session ID:', req.query.session_id);
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

        res.status(200).json({
            status: session.status,
            customer_email: session.customer_details.email,
        });
    } catch (error) {
        console.error('Error retrieving session status:', error);
        res.status(500).json({ error: error.message });
    }
};

export const cancelSubscription = async (req, res) => {
    const { subscriptionId } = req.body;
    try {
        const user = await User.findById(req.user._id);

        const subscription = await stripe.subscriptions.del(subscriptionId);

        user.subscription = 'free';
        user.subscriptionType = 'freeLifetime';
        await user.save();

        res.status(200).json({ subscription });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: error.message });
    }
};

export const refundAllPayments = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.stripeCustomerId) {
            return res.status(400).json({ error: 'User does not have a Stripe customer ID' });
        }

        const paymentIntents = await stripe.paymentIntents.list({
            customer: user.stripeCustomerId,
            limit: 100
        });

        const refundPromises = paymentIntents.data.map(paymentIntent => {
            return stripe.refunds.create({
                payment_intent: paymentIntent.id
            });
        });

        const refunds = await Promise.all(refundPromises);

        res.status(201).json({ refunds });
    } catch (error) {
        console.error('Error refunding payments:', error);
        res.status(500).json({ error: error.message });
    }
};

const lifetimePriceId = process.env.STRIPE_LIFETIME_PRICE_ID; // Add the lifetime price ID to your environment variables

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const customerId = session.customer;
            const userId = session.metadata.userId; // Extract user ID from metadata

            let user = await User.findById(userId); // Find user by ID

            if (user) {
                user.stripeCustomerId = customerId;
                user.subscription = 'pro';

                const isLifetime = session.display_items.some(item => item.price.id === lifetimePriceId);
                user.subscriptionType = isLifetime ? 'paidLifetime' : 'recurring';

                user.subscriptionStartDate = new Date();
                await user.save();
            }
            break;
        }
        case 'invoice.payment_succeeded': {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            const userId = invoice.metadata.userId; // Extract user ID from metadata

            let user = await User.findOne({ stripeCustomerId: customerId });
            if (!user) {
                user = await User.findById(userId); // Find user by ID if not found by customer ID
                if (user) {
                    user.stripeCustomerId = customerId;
                    await user.save();
                }
            }

            if (user) {
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
                user.subscription = 'pro';

                const isLifetime = subscription.items.data.some(item => item.price.id === lifetimePriceId);
                user.subscriptionType = isLifetime ? 'paidLifetime' : 'recurring';

                user.subscriptionStartDate = new Date(subscription.current_period_start * 1000);
                user.subscriptionEndDate = isLifetime ? null : new Date(subscription.current_period_end * 1000);
                await user.save();
            }
            break;
        }
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const customerId = paymentIntent.customer;
            const userId = paymentIntent.metadata.userId; // Extract user ID from metadata

            let user = await User.findOne({ stripeCustomerId: customerId });
            if (!user) {
                user = await User.findById(userId); // Find user by ID if not found by customer ID
                if (user) {
                    user.stripeCustomerId = customerId;
                    await user.save();
                }
            }

            if (user) {
                user.subscription = 'pro';

                const isLifetime = paymentIntent.charges.data[0].invoice.lines.data.some(item => item.price.id === lifetimePriceId);
                user.subscriptionType = isLifetime ? 'paidLifetime' : 'recurring';

                user.subscriptionStartDate = new Date();
                await user.save();
            }
            break;
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const userId = subscription.metadata.userId; // Extract user ID from metadata

            let user = await User.findOne({ stripeCustomerId: customerId });
            if (!user) {
                user = await User.findById(userId); // Find user by ID if not found by customer ID
                if (user) {
                    user.stripeCustomerId = customerId;
                    await user.save();
                }
            }

            if (user) {
                user.subscription = 'pro';

                const isLifetime = subscription.items.data.some(item => item.price.id === lifetimePriceId);
                user.subscriptionType = isLifetime ? 'paidLifetime' : 'recurring';

                user.subscriptionStartDate = new Date(subscription.current_period_start * 1000);
                user.subscriptionEndDate = isLifetime ? null : new Date(subscription.current_period_end * 1000);
                await user.save();
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const userId = subscription.metadata.userId; // Extract user ID from metadata

            const user = await User.findOne({ stripeCustomerId: customerId });
            if (user) {
                user.subscription = 'free';
                user.subscriptionType = 'freeLifetime';
                user.subscriptionStartDate = null;
                user.subscriptionEndDate = null;
                await user.save();
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};