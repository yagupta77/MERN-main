const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as necessary

// Allowed roles
const allowedRoles = ['reviewer', 'approver', 'initiator'];

// Registration route
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    // Check for required fields and provide specific error messages
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate role
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
        return res.status(400).json({ message: 'User  with this email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser  = new User({
        email,
        password: hashedPassword,
        role // This can now be 'initiator', 'reviewer', or 'approver'
    });

    try {
        await newUser .save();
        res.status(201).json({ message: 'User  registered successfully', user: { email, role } });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'User  with this email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;