import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import habitRoutes from './routes/habit.js';
import bodyParser from 'body-parser';
import cors from 'cors';
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

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to the database!');
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
// Protected routes example
// app.use('/api/protected', authenticate, protectedRoutes);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
