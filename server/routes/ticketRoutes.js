// src/routes/ticketRoutes.js

const express = require('express');
const TicketService = require('../services/ticketService');
const ensureAuthenticated = require('../middleware/authentication'); // Assuming you created this
const router = express.Router();

/**
 * @route   GET /api/tickets
 * @desc    Get all tickets for the currently authenticated user
 * @access  Private
 */
router.get('/getTicketsByUserId', ensureAuthenticated, async (req, res) => {
  try {
    // We are guaranteed by the `ensureAuthenticated` middleware that req.user exists.
    const userId = req.user._id;
    console.log(`I am helping this user: ${userId}`);
    
    const tickets = await TicketService.getTicketsByUserId(userId);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Don't forget to export the router!
module.exports = router;