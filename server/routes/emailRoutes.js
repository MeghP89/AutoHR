const express = require('express');
const { pollForNewEmails } = require('../controllers/emailController');
const router = express.Router();

router.get('/emails', async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
        }
    
        // Start polling for new emails
        const interval = await pollForNewEmails(60000, req.user); // Poll every 60 seconds
        res.status(200).json({ message: 'Polling started', interval });
    } catch (error) {
        console.error('Error starting email polling:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router; // ✅ Make sure you're exporting the router
