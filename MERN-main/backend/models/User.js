// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Changed from username to email
    password: { type: String, required: true },
    role: { type: String, enum: ['initiator', 'reviewer', 'approver'], required: true }
});

module.exports = mongoose.model('User ', userSchema);