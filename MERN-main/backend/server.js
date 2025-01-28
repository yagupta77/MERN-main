const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoutes = require('./routes/auth'); // Authentication routes
const applicationRoutes = require('./routes/ApplicationRoutes'); // Application routes
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
 // MongoDB connection function

// Load environment variables from .env file
dotenv.config();

// Debugging line to check MongoDB URI
console.log('MongoDB URI:', process.env.MONGO_URI);

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Set security-related HTTP headers
app.use(morgan('dev')); // Log requests to the console in 'dev' format
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/applications', applicationRoutes); 
app.use('/api/auth', authRoutes); // Authentication routes
// Application routes
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error message
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});