import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApplicationForm = () => {
    const [details, setDetails] = useState('');
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get the token from local storage or wherever you store it
        const token = localStorage.getItem('token');

        // Create a FormData object to handle the file upload
        const formData = new FormData();
        formData.append('details', details);
        formData.append('resume', resume);

        try {
            const response = await axios.post('http://localhost:5000/api/applications', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Application submitted successfully:', response.data);

            // Check if the response indicates no approved applications
            if (response.data && response.data.length === 0) {
                setError('No approved applications available. Please check back later.');
            } else {
                setSuccessMessage('Application submitted successfully!');
                // Optionally navigate to another page after successful submission
                navigate('/user-dashboard'); // Adjust the path as needed
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setError('Error submitting application. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Submit Application</h2>
            <textarea 
                placeholder="Details" 
                onChange={(e) => setDetails(e.target.value)} 
                required 
            />
            <input 
                type="file" 
                onChange={(e) => setResume(e.target.files[0])} 
                required 
            />
            <button type="submit">Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default ApplicationForm;