// src/components/JobSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredJobs, setFilteredJobs] = useState([]); // State for filtered jobs
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/jobs'); // Ensure this matches your backend route
                setJobs(response.data);
                setFilteredJobs(response.data); // Initially set filtered jobs to all jobs
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    const handleSearch = () => {
        // Filter jobs based on searchTerm
        const filtered = jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJobs(filtered); // Update filtered jobs state
    };

    const handleApply = (jobId) => {
        // Navigate to the application page for the selected job
        navigate(`/apply/${jobId}`); // Adjust the route as necessary
    };

    return (
        <div>
            <h1>Job Search</h1>
            <input
                type="text"
                placeholder="Search for jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <li key={job._id}>
                            {job.title} - {job.company}
                            <button onClick={() => handleApply(job._id)}>Apply</button> {/* Apply button */}
                        </li>
                    ))
                ) : (
                    <li>No jobs found</li> // Message when no jobs match the search
                )}
            </ul>
        </div>
    );
};

export default JobSearch;