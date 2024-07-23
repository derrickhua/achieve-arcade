import 'module-alias/register.js'; // Add this line at the top of your file
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import habitRoutes from './routes/habit.js';
import goalRoutes from './routes/goal.js';
import dailyScheduleRoutes from './routes/dailySchedule.js';
import dashboardRoutes from './routes/dashboard.js';
import taskRoutes from './routes/task.js';
import rewardRoutes from './routes/reward.js';
import suggestionRoutes from './routes/suggestion.js';
import stripeRoutes from './routes/stripe.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to the database!');
});

// Middleware
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/daily-schedule', dailyScheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/stripe', stripeRoutes);

// Error handler
app.use((err, req, res, next) => {
  const errorDetails = {
    path: req.path,
    method: req.method,
    message: err.message || 'Something went wrong.',
    status: err.status || 500,
    errorName: err.name,
    clientMessage: 'Something went wrong.'
  };

  if (err.name === 'ValidationError') {
    errorDetails.status = 400;
    errorDetails.clientMessage = 'Validation failed.';
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    errorDetails.status = 400;
    errorDetails.clientMessage = 'Invalid identifier format.';
  } else if (err.name === 'UnauthorizedError') {
    errorDetails.status = 401;
    errorDetails.clientMessage = 'Unauthorized access.';
  } else if (err.name === 'NotFoundError') {
    errorDetails.status = 404;
    errorDetails.clientMessage = 'Resource not found.';
  }

  console.error('API Error:', JSON.stringify(errorDetails));
  res.status(errorDetails.status).json({ error: errorDetails.clientMessage });
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
