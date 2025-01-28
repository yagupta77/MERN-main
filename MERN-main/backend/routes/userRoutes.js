// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const authMiddleware = require('../middleware/auth'); // Import your auth middleware

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;