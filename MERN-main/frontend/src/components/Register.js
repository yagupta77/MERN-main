// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const [role, setRole] = useState('initiator'); // Default role
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading to true
        setError(''); // Reset error message

        // Client-side validation
        if (!username || !email || !password || !role) {
            setError('All fields are required');
            setLoading(false); // Reset loading state
            return;
        }

        // Role validation
        const allowedRoles = ['initiator', 'reviewer', 'approver'];
        if (!allowedRoles.includes(role)) {
            setError('Invalid role selected');
            setLoading(false);
            return;
        }

        try {
            // Log the data being sent
            console.log({ username, email, password, role });

            // Send registration request to the server
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
            
            // Redirect to login after successful registration
            navigate('/login'); // Redirect to login page
        } catch (err) {
            console.error(err.response.data); // Log the error response for debugging
            setError(err.response.data.message || 'Registration failed');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="initiator">Initiator</option>
                <option value="reviewer">Reviewer</option>
                <option value="approver">Approver</option>
            </select>
            <button type="submit" disabled={loading}> {/* Disable button while loading */}
                {loading ? 'Registering...' : 'Register'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
};

export default Register;