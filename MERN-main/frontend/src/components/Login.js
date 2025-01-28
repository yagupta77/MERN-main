// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        setError(''); // Reset error message

        // Client-side validation
        if (!username || !email || !password) {
            setError('All fields are required');
            setLoading(false); // Reset loading state
            return;
        }

        try {
            // Log the data being sent
            console.log({ username, email, password });

            // Send login request to the server
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, email, password });
            localStorage.setItem('token', response.data.token); // Store the token in local storage
            
            // Check the user's role and navigate accordingly
            const role = response.data.role; // Assuming the role is returned in the response
            if (role === 'reviewer') {
                navigate('/review'); // Redirect to reviewer dashboard
            } else if (role === 'approver') {
                navigate('/approver-dashboard'); // Redirect to approver dashboard
            } else {
                navigate('/apply'); // Redirect to user dashboard for regular users
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('Login failed. Please check your username, email, and password.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Login;