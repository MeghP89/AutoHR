const express = require('express');
const { pollForNewEmails } = require('../controllers/emailController');
const { createEmail } = require('../controllers/ollamaController')
const router = express.Router();

router.get('/emails', async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
        }
    
        // Start polling for new emails
        const interval = await pollForNewEmails(10000, req.user); // Poll every 60 seconds
        res.status(200).json({ message: 'Polling started', interval });
    } catch (error) {
        console.error('Error starting email polling:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/sendEmail', async (req, res) => {
  try {
    const { ticket } = req.body;

    if (!ticket || !ticket._id) {
      return res.status(400).json({ error: 'Missing or invalid ticket data.' });
    }

    const email = await createEmail(ticket);

    if (!email) {
      return res.status(500).json({ error: 'Failed to generate or send email.' });
    }

    res.status(200).json({ message: 'Email sent successfully.', email });
  } catch (error) {
    console.error('❌ Error in /sendEmail:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router; // ✅ Make sure you're exporting the router
