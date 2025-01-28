// src/components/ApplicationStatus.js
import React from 'react';

const ApplicationStatus = ({ application }) => {
    return (
        <div>
            <h3>Application ID: {application._id}</h3>
            <p>Status: {application.status}</p>
            <p>Details: {application.details}</p>
            <a href={application.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
        </div>
    );
};

export default ApplicationStatus;