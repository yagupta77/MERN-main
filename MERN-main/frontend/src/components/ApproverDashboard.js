import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproverDashboard = () => {
    const [approvedApplications, setApprovedApplications] = useState([]); // State to hold approved applications
    const [pendingApplications, setPendingApplications] = useState([]); // State to hold pending applications
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading indicator

    const fetchApplications = async () => {
        setLoading(true); // Set loading to true when fetching data
        const token = localStorage.getItem('token'); // Retrieve the token
        if (!token) {
            console.error('No token found. User might not be logged in.');
            setError('You need to log in to view applications.');
            setLoading(false);
            return; // Exit if no token is found
        }

        try {
            // Fetch approved applications
            const approvedResponse = await axios.get('http://localhost:5000/api/applications/approved', {
                headers: { Authorization: `Bearer ${token}` } // Use the retrieved token
            });
            console.log('Approved applications fetched:', approvedResponse.data); // Log the fetched applications
            setApprovedApplications(approvedResponse.data); // Set the approved applications

            // Fetch pending applications
            const pendingResponse = await axios.get('http://localhost:5000/api/applications/pending', {
                headers: { Authorization: `Bearer ${token}` } // Use the retrieved token
            });
            console.log('Pending applications fetched:', pendingResponse.data); // Log the fetched applications
            setPendingApplications(pendingResponse.data); // Set the pending applications
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError('Error fetching applications. Please try again later.'); // Handle error state
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchApplications(); // Fetch applications on component mount
    }, []); // Fetch applications only once on mount

    const handleApprove = async (applicationId) => {
        if (window.confirm('Are you sure you want to approve this application?')) {
            const token = localStorage.getItem('token'); // Retrieve the token again for debugging
            console.log('Token received for approval:', token); // Debugging line
            try {
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/approve`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Application approved successfully.');

                // Remove the approved application from the pending state
                setPendingApplications((prevApplications) => 
                    prevApplications.filter(app => app._id !== applicationId)
                ); // Update the state to remove the approved application

                // Optionally, you can also fetch approved applications again to update the list
                fetchApplications(); // Re-fetch applications to update the approved list
            } catch (error) {
                console.error('Error approving application:', error);
                setError('Failed to approve application. Please try again later.');
            }
        } 
    };

    const handleReject = async (applicationId) => {
        if (window.confirm('Are you sure you want to reject this application?')) {
            const token = localStorage.getItem('token'); // Retrieve the token again for debugging
            console.log('Token received for rejection:', token); // Debugging line
            try {
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/reject`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Application rejected successfully.');

                // Remove the rejected application from the pending state
                setPendingApplications((prevApplications) => 
                    prevApplications.filter(app => app._id !== applicationId)
                ); // Update the state to remove the rejected application
            } catch (error) {
                console.error('Error rejecting application:', error);
                setError('Failed to reject application. Please try again later.');
            }
        } 
    };

    const downloadResume = (resumeBuffer) => {
        const blob = new Blob([resumeBuffer], { type: 'application/pdf' }); // Adjust the MIME type as necessary
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf'; // Set the default file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    };

    return (
        <div>
            <h1>Pending Applications</h1>
            {loading && <p>Loading applications...</p>} {/* Loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {pendingApplications.length > 0 ? (
                pendingApplications.map(app => (
                    <div key={app._id}>
                        <h3>Application ID: {app._id}</h3>
                        <p>Initiator ID: {app.initiatorId}</p>
                        <p>Status: {app.status}</p>
                        <p>Remarks:</p>
                        <ul>
                            {app.remarks.map((remark, index) => (
                                <li key={index}>{remark.remark}</li>
                            ))}
                        </ul>
                        {/* Approve and Reject buttons */}
                        <button onClick={() => handleApprove(app._id)}>Approve</button>
                        <button onClick={() => handleReject(app._id)}>Reject</button>
                        {/* Download Resume button */}
                        <button onClick={() => downloadResume(app.resume)}>Download Resume</button>
                    </div>
                ))
            ) : (
                <p>No pending applications found.</p> // Message when no pending applications are available
            )}
    
          
        </div>
    );
};

export default ApproverDashboard; // Move this line outside of the return statement