// routes/JobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Import your Job model

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find(); // Fetch all jobs from the database
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new job
router.post('/', async (req, res) => {
    const { title, company, description, location } = req.body;
    const newJob = new Job({ title, company, description, location });

    try {
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;