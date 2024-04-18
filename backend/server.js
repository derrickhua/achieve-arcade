import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import Agenda from 'agenda';
import cookieParser from 'cookie-parser';
import { defineAndScheduleJobs } from './agendaJobs.js';
import userRoutes from './routes/user.js';
import habitRoutes from './routes/habit.js';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend to access the backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify which methods are allowed
  credentials: true // Allow cookies to be sent across domains (if using sessions or cookies)
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/tempus');
const db = mongoose.connection;

// Initialize Agenda
const agenda = new Agenda({db: {address: 'mongodb://localhost/tempus'}});

// Define and schedule your jobs
(async function() {
  await defineAndScheduleJobs(agenda);  
  await agenda.start();
})();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to the database!');
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
// Protected routes example
// app.use('/api/protected', authenticate, protectedRoutes);


// Error handler
app.use((err, req, res, next) => {
  const errorDetails = {
      path: req.path,
      method: req.method,
      message: err.message || 'Something went wrong.',
      status: err.status || 500,
      errorName: err.name,
      clientMessage: 'Something went wrong.' // Default client message
  };

  // Handle specific types of errors with more context
  if (err.name === 'ValidationError') {
      errorDetails.status = 400;
      errorDetails.clientMessage = 'Validation failed.';
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
      errorDetails.status = 400;
      errorDetails.clientMessage = 'Invalid identifier format.';
  } else if (err.name === 'UnauthorizedError') { // Assuming a custom or JWT auth error
      errorDetails.status = 401;
      errorDetails.clientMessage = 'Unauthorized access.';
  } else if (err.name === 'NotFoundError') { // Custom not found error
      errorDetails.status = 404;
      errorDetails.clientMessage = 'Resource not found.';
  }

  // Structured Logging
  console.error('API Error:', JSON.stringify(errorDetails));

  // Send the error response
  res.status(errorDetails.status).json({ error: errorDetails.clientMessage });
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
