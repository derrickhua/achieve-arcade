import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Agenda from 'agenda';
import { defineAndScheduleJobs } from './agendaJobs.js';
import userRoutes from './routes/user.js';
import habitRoutes from './routes/habit.js';
import goalRoutes from './routes/goal.js';
import dailyScheduleRoutes from './routes/dailySchedule.js';
import dashboardRoutes from './routes/dashboard.js';
import taskRoutes from './routes/task.js';
import rewardRoutes from './routes/reward.js';
import suggestionRoutes from './routes/suggestion.js';
import stripeRoutes from './routes/stripe.js'; // Ensure this is imported
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/tempus');
const db = mongoose.connection;

// Initialize Agenda
const agenda = new Agenda({ db: { address: 'mongodb://localhost/tempus' } });

(async function() {
  await defineAndScheduleJobs(agenda);  
  await agenda.start();
})();

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
app.use('/api/stripe', stripeRoutes); // Include the stripe routes here

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
