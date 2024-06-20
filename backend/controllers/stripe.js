import Stripe from 'stripe';
import User from '../models/user.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = 'http://localhost:3000';

export const createCheckoutSession = async (req, res) => {
    const { userId } = req.body;
    console.log('Received request to create checkout session for user ID:', userId);

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
                userId: userId.toString(), // Attach the user ID to the metadata
            },
        });

      
        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('stripeCustomerId');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.stripeCustomerId) {
            return res.status(400).json({ error: 'User does not have a Stripe customer ID' });
        }

        // Fetch all active subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'active',
            limit: 1, // Assuming the user has only one active subscription
        });

        if (subscriptions.data.length === 0) {
            return res.status(404).json({ error: 'No active subscriptions found for this user' });
        }

        const subscriptionId = subscriptions.data[0].id;

        // Cancel the subscription immediately
        const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

        // Fetch the latest invoice for the subscription
        const invoices = await stripe.invoices.list({
            subscription: subscriptionId,
            limit: 1,
        });

        if (invoices.data.length === 0) {
            return res.status(404).json({ error: 'No invoices found for this subscription' });
        }

        const latestInvoice = invoices.data[0];

        // Refund the latest invoice's payment
        const paymentIntentId = latestInvoice.payment_intent;
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
        });

        // Update user subscription information
        await User.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    subscription: 'free',
                    subscriptionType: 'freeLifetime'
                }
            }
        );

        res.status(200).json({
            canceledSubscription,
            refund, // Include refund information in the response
        });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: error.message });
    }
};



export const refundAllPayments = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('stripeCustomerId');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.stripeCustomerId) {
            return res.status(400).json({ error: 'User does not have a Stripe customer ID' });
        }

        const paymentIntents = await stripe.paymentIntents.list({
            customer: user.stripeCustomerId,
            limit: 100
        });

        const refundPromises = paymentIntents.data.map(paymentIntent => 
            stripe.refunds.create({ payment_intent: paymentIntent.id })
        );

        const refunds = await Promise.all(refundPromises);

        res.status(201).json({ refunds });
    } catch (error) {
        console.error('Error refunding payments:', error);
        res.status(500).json({ error: error.message });
    }
};

const lifetimePriceId = 'price_1PTlqFP21qukNQhz03LpRxiX'; 

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

    console.log(`Handling event type: ${event.type}`);

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const customerId = session.customer;
            const userId = session.metadata.userId;
            const mode = session.mode;

            console.log(`Handling checkout.session.completed for user ${userId} with mode ${mode}`);

            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
                expand: ['line_items'],
            });

            const isLifetime = sessionWithLineItems.line_items.data.some(item => item.price.id === lifetimePriceId);

            await User.updateOne(
                { _id: userId },
                {
                    $set: {
                        stripeCustomerId: customerId,
                        subscription: 'pro',
                        subscriptionType: isLifetime ? 'paidLifetime' : (mode === 'subscription' ? 'recurring' : 'oneTime'),
                        subscriptionStartDate: new Date(),
                        subscriptionEndDate: isLifetime ? null : (mode === 'subscription' ? new Date(session.current_period_end * 1000) : null)
                    }
                }
            );

            console.log(`User ${userId} updated successfully with subscriptionType: ${isLifetime ? 'paidLifetime' : (mode === 'subscription' ? 'recurring' : 'oneTime')}`);
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const customerId = subscription.customer;

            console.log(`Handling customer.subscription.deleted for customer ${customerId}`);

            await User.updateOne(
                { stripeCustomerId: customerId },
                {
                    $set: {
                        subscription: 'free',
                        subscriptionType: 'freeLifetime',
                        subscriptionStartDate: null,
                        subscriptionEndDate: null
                    }
                }
            );

            console.log(`User subscription cancelled for customer ${customerId}`);
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    res.json({ received: true });
};