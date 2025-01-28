// src/components/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/applications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div>
            <h1>User Dashboard</h1>
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id}>
                        <h3>Application ID: {app._id}</h3>
                        <p>{app.details}</p>
                        <p>Status: {app.status}</p> {/* Display application status */}
                        {app.remark && <p>Remark: {app.remark}</p>} {/* Display remark if any */}
                    </div>
                ))
            ) : (
                <p>No applications submitted.</p>
            )}
        </div>
    );
};

export default UserDashboard;