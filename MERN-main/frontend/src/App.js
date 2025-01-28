import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ApplicationForm from './components/ApplicationForm'; // Ensure this is imported
import Review from './components/Review';
import UserDashboard from './components/UserDashboard';
import ApproverDashboard from './components/ApproverDashboard';

// NotFound component for 404 errors
const NotFound = () => {
    return (
        <div>
            <h2>404 Not Found</h2>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
};

const App = () => {
    const [token, setToken] = useState(''); // Manage token state

    return (
        <Router>
            <div className="App">
                <h1>Job Application Portal</h1>
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/apply" element={<ApplicationForm />} /> {/* Correctly closed */}
                    <Route path="/review" element={<Review />} />
                    <Route path="/user-dashboard" element={<UserDashboard token={token} />} /> {/* Pass token */}
                    <Route path="/approver-dashboard" element={<ApproverDashboard token={token} />} /> {/* Pass token */}
                    <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;