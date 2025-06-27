const express = require('express');
const router = express.Router();
const { pollForNewEmails } = require('../controllers/emailController');


router.get('/emails', pollForNewEmails);

module.exports = router; // ✅ Make sure you're exporting the router
