const express = require('express');
const multer = require('multer');
const router = express.Router();
const Application = require('../models/Application'); // Import your Application model
const authMiddleware = require('../middleware/auth'); // Import your auth middleware

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Create a new application
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
    const userId = req.user.id; // Get the user ID from the auth middleware

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const application = new Application({
        initiatorId: userId, // Store the initiator's ID
        resume: req.file.buffer, // Access the file buffer
        status: 'pending', // Initial status
        reviewers: [], // Initialize reviewers array
        remarks: [] // Initialize remarks array
    });

    try {
        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all applications for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ initiatorId: req.user.id }).populate('initiatorId', 'username');
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Send application to approver
router.put('/:id/send-to-approver', authMiddleware, async (req, res) => {
    const applicationId = req.params.id; // Get the application ID from the request parameters
    const { remark } = req.body; // Get the remark from the request body

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update the application status and add the remark
        application.status = 'pending approval'; // Change status to pending approval
        application.remarks.push({ remark, reviewerId: req.user._id }); // Add the remark with reviewer ID

        await application.save(); // Save the updated application
        res.status(200).json({ message: 'Application sent to approver successfully' });
    } catch (error) {
        console.error('Error sending application to approver:', error);
        res.status(500).json({ message: 'Error sending application to approver' });
    }
});

// Provide remark and delete application
router.put('/:id/remark', authMiddleware, async (req, res) => {
    const applicationId = req.params.id; // Get the application ID from the request parameters
    const { remark } = req.body; // Get the remark from the request body

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Add the remark
        application.remarks.push({ remark, reviewerId: req.user._id }); // Add the remark with reviewer ID

        await application.save(); // Save the updated application

        // Delete the application after providing a remark
        await application.remove(); // Remove the application from the database

        res.status(200).json({ message: 'Remark submitted and application deleted successfully' });
    } catch (error) {
        console.error('Error providing remark:', error);
        res.status(500).json({ message: 'Error providing remark' });
    }
});

// Approve application
router.put('/:id/approve', authMiddleware, async (req, res) => {
    const reviewerId = req.user._id;
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        console.log('Current application status before approval:', application.status);
        application.status = 'approved'; // Set status to approved
        if (!application.reviewers.includes(reviewerId)) {
            application.reviewers.push(reviewerId); // Add reviewer ID if not already present
        }
        await application.save(); // Save the changes
        console.log('New application status after approval:', application.status);
        res.status(200).json({ message: 'Application approved successfully' });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ message: 'Error approving application' });
    }
});
// Reject application
router.put('/:id/reject', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Check if the user is an approver
        if (req.user.role !== 'approver') {
            return res.status(403).json({ message: 'You are not authorized to reject this application.' });
        }

        application.status = 'rejected'; // Update status
        application.approverId = req.user.id; // Store the approver's ID
        await application.save();

        res.status(200).json({ message: 'Application rejected successfully', application });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
});

// Get pending applications
// In your Approver's route
router.get('/pending', authMiddleware, async (req, res) => {
    try {
        const pendingApplications = await Application.find({ status: 'pending approval' });
        console.log('Pending applications found:', pendingApplications); // Log the found applications
        res.status(200).json(pendingApplications);
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({ message: 'Error fetching pending applications' });
    }
});
// Route to get approved applications
router.get('/approved', authMiddleware, async (req, res) => {
    try {
        const approvedApplications = await Application.find({ status: 'approved' }).populate('initiatorId');
        console.log('Approved applications found:', approvedApplications); 
        res.status(200).json(approvedApplications);
    } catch (error) {
        console.error('Error fetching approved applications:', error);
        res.status(500).json({ message: 'Error fetching approved applications' });
    }
});
// Delete application
// router.delete('/:id', authMiddleware, async (req, res) => {
//     const applicationId = req.params.id; // Get the application ID from the request parameters

//     try {
//         const application = await Application.findById(applicationId);
//         if (!application) {
//             return res.status(404).json({ message: 'Application not found' });
//         }

//         await application.remove(); // Delete the application
//         res.status(200).json({ message: 'Application deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting application:', error);
//         res.status(500).json({ message: 'Error deleting application' });
//     }
// });
// Export the router
module.exports = router;