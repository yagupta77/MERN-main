// seed.js
const mongoose = require('mongoose');
const Job = require('./models/Job'); // Adjust the path as necessary
const connectDB = require('./config/db'); // Adjust the path as necessary
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const jobs = [
    {
        title: 'Software Engineer',
        company: 'Tech Company',
        description: 'Develop and maintain software applications.',
        location: 'Remote',
    },
    {
        title: 'Product Manager',
        company: 'Business Inc.',
        description: 'Lead product development and strategy.',
        location: 'New York, NY',
    },
    // Add more job objects as needed
];

const seedDB = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        await Job.deleteMany({}); // Clear existing jobs
        await Job.insertMany(jobs); // Insert new jobs
        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
};

seedDB();