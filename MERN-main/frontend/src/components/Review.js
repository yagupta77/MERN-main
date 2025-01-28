import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Review = () => {
    const [applications, setApplications] = useState([]); // State to hold applications
    const [selectedApplication, setSelectedApplication] = useState(null); // State for the selected application
    const [remark, setRemark] = useState(''); // State for the remark input
    const [status, setStatus] = useState(''); // State for the selected action (selected/unselected)
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(true); // Loading state
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages

    // Fetch applications when the component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/applications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setApplications(response.data); // Set applications from the response
            } catch (err) {
                setError('Error fetching applications'); // Set error message if fetching fails
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchApplications();
    }, []);

    const handleReview = async (applicationId) => {
        try {
            if (status === 'selected') {
                // Send to approver
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/send-to-approver`, {
                    remark
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSuccessMessage('Application sent to approver successfully!'); // Success message
            } else if (status === 'unselected') {
                // Provide remark to user and delete application
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/remark`, {
                    remark
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSuccessMessage('Remark submitted and application deleted successfully!'); // Success message
            }

            // Remove the reviewed application from the state
            setApplications(applications.filter(app => app._id !== applicationId));

            // Clear the form
            setRemark('');
            setStatus('');
            setSelectedApplication(null);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('You do not have permission to perform this action.'); // Handle permission error
            } else {
                setError('Error submitting review'); // Handle other errors
            }
        }
    };

    // Loading state
    if (loading) {
        return <p>Loading applications...</p>; // Loading message
    }

    const downloadResume = async (resumeUrl) => {
        try {
            const response = await axios.get(resumeUrl, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' }); // Adjust the MIME type as necessary
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf'; // Set the default file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            setError('Error downloading resume'); // Handle download error
        }
    };

    return (
        <div>
            <h1>Review Applications</h1>
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id}>
                        <h3>Application ID: {app._id}</h3>
                        <button onClick={() => setSelectedApplication(app)}>Review</button>
                    </div>
                ))
            ) : (
                <p>No applications to review</p> // Message when no applications are available
            )}
            {selectedApplication && (
                <div>
                    <h2>Review Application ID: {selectedApplication._id}</h2>
                    <textarea 
                        value={remark} 
                        onChange={(e) => setRemark(e.target.value)} 
                        placeholder="Enter remark" 
                    />
                   
                   <select onChange={(e) => setStatus(e.target.value)} value={status}>
                        <option value="">Select Action</option>
                        <option value="selected">Select (Send to Approver)</option>
                        <option value="unselected">Unselect (Provide Remark)</option>
                    </select>
                    <button onClick={() => handleReview(selectedApplication._id)}>Submit Review</button>
                    <button onClick={() => downloadResume(selectedApplication.resume)}>Download Resume</button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
        </div>
    );
};

export default Review;