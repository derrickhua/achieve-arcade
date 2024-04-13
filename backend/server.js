import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/tempus');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to the database!');
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
