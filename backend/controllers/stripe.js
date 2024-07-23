import Stripe from 'stripe';
import User from '../models/user.js';
import Goal from '../models/goal.js';
import Task from '../models/task.js';
import Habit from '../models/habit.js';
import { sendPurchaseConfirmationEmail, sendCancellationEmail } from './email.js'; // Adjust the import path accordingly

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {
    const { userId } = req.body;
    console.log('Received request to create checkout session for user ID:', userId);

    try {
        const totalUserCount = await User.countDocuments();
        let priceId;
        let mode;

        //  when there are 50 paid users ill switch it ofter 
        priceId = 'price_1PX4Q7P21qukNQhzF3ze6I8K'; // One-time fee for lifetime
        mode = 'payment';
        // if (totalUserCount < 100) {
        //     priceId = 'price_1PX4Q7P21qukNQhzF3ze6I8K'; // One-time fee for lifetime
        //     mode = 'payment';
        // } else {
        //     priceId = 'price_1PX4M3P21qukNQhzACg5mbm1'; // Recurring fee
        //     mode = 'subscription';
        // }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode,
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
            automatic_tax: { enabled: true },
            metadata: {
                userId: userId.toString(), // Attach the user ID to the metadata
            },
            currency: 'cad'
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
};


export const cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('stripeCustomerId subscription');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user is part of the first 50 users (who don't have a Stripe customer ID)
        if (!user.stripeCustomerId) {
            console.log('User is part of the first 50 free users');

            // Check and delete tasks, goals, and habits if user has too many active items
            const maxGoals = 2;
            const maxHabits = 2;
            const maxTasks = 4;

            // Delete extra active goals
            const activeGoals = await Goal.find({ user: req.user._id, completed: false }).sort({ createdAt: 1 });
            if (activeGoals.length > maxGoals) {
                const goalsToDelete = activeGoals.slice(0, activeGoals.length - maxGoals);
                await Goal.deleteMany({ _id: { $in: goalsToDelete.map(goal => goal._id) } });
            }

            // Delete extra active habits
            const activeHabits = await Habit.find({ user: req.user._id }).sort({ createdAt: 1 });
            if (activeHabits.length > maxHabits) {
                const habitsToDelete = activeHabits.slice(0, activeHabits.length - maxHabits);
                await Habit.deleteMany({ _id: { $in: habitsToDelete.map(habit => habit._id) } });
            }

            // Delete extra active tasks
            const activeTasks = await Task.find({ userId: req.user._id, completed: false }).sort({ createdAt: 1 });
            if (activeTasks.length > maxTasks) {
                const tasksToDelete = activeTasks.slice(0, activeTasks.length - maxTasks);
                await Task.deleteMany({ _id: { $in: tasksToDelete.map(task => task._id) } });
            }

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

            return res.status(200).json({
                message: 'Subscription updated to free',
            });
        }

        // For users with a Stripe customer ID
        console.log('User has a Stripe customer ID');

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

        // Check and delete tasks, goals, and habits if user has too many active items
        const maxGoals = 2;
        const maxHabits = 2;
        const maxTasks = 4;

        // Delete extra active goals
        const activeGoals = await Goal.find({ user: req.user._id, completed: false }).sort({ createdAt: 1 });
        if (activeGoals.length > maxGoals) {
            const goalsToDelete = activeGoals.slice(0, activeGoals.length - maxGoals);
            await Goal.deleteMany({ _id: { $in: goalsToDelete.map(goal => goal._id) } });
        }

        // Delete extra active habits
        const activeHabits = await Habit.find({ user: req.user._id }).sort({ createdAt: 1 });
        if (activeHabits.length > maxHabits) {
            const habitsToDelete = activeHabits.slice(0, activeHabits.length - maxHabits);
            await Habit.deleteMany({ _id: { $in: habitsToDelete.map(habit => habit._id) } });
        }

        // Delete extra active tasks
        const activeTasks = await Task.find({ userId: req.user._id, completed: false }).sort({ createdAt: 1 });
        if (activeTasks.length > maxTasks) {
            const tasksToDelete = activeTasks.slice(0, activeTasks.length - maxTasks);
            await Task.deleteMany({ _id: { $in: tasksToDelete.map(task => task._id) } });
        }

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

const lifetimePriceId = 'price_1PX4Q7P21qukNQhzF3ze6I8K'; 

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
            const userEmail = session.customer_details.email;

            console.log(`Handling checkout.session.completed for user ${userId} with mode ${mode}`);

            try {
                const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items'],
                });

                const isLifetime = sessionWithLineItems.line_items.data.some(item => item.price.id === lifetimePriceId);

                const user = await User.findById(userId);

                if (!user) {
                    throw new Error(`User with ID ${userId} not found`);
                }

                const totalUserCount = await User.countDocuments();

                const subscriptionType = totalUserCount < 100 ? 'paidLifetime' : (isLifetime ? 'paidLifetime' : (mode === 'subscription' ? 'recurring' : 'oneTime'));

                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            stripeCustomerId: customerId,
                            subscription: 'pro',
                            subscriptionType,
                            subscriptionStartDate: new Date(),
                            subscriptionEndDate: isLifetime ? null : (mode === 'subscription' ? new Date(session.current_period_end * 1000) : null)
                        }
                    }
                );

                await sendPurchaseConfirmationEmail(userEmail, user.username);

                console.log(`User ${userId} updated successfully with subscriptionType: ${subscriptionType}`);
            } catch (err) {
                console.error(`Failed to handle checkout.session.completed for user ${userId}:`, err.message);
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const customerId = subscription.customer;

            console.log(`Handling customer.subscription.deleted for customer ${customerId}`);

            try {
                const user = await User.findOne({ stripeCustomerId: customerId });

                if (!user) {
                    throw new Error(`User with customerId ${customerId} not found`);
                }

                await User.updateOne(
                    { stripeCustomerId: customerId },
                    {
                        $set: {
                            subscription: 'free',
                            subscriptionType: 'free',
                            subscriptionStartDate: null,
                            subscriptionEndDate: null
                        }
                    }
                );

                await sendCancellationEmail(user.email, user.username);

                console.log(`User subscription cancelled for customer ${customerId}`);
            } catch (err) {
                console.error(`Failed to handle customer.subscription.deleted for customer ${customerId}:`, err.message);
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    res.json({ received: true });
};
