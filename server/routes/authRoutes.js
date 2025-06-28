const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authentication')

router.get('/login/federated/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.readonly'
  ],
  accessType: 'offline', // Ensures refresh token
  prompt: 'consent',      // Forces consent screen
  // session: false
}));

router.get('/ensureAuthenticated', ensureAuthenticated, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}`, user: req.user, authenticated:true });
});

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: 'http://localhost:5173/dashboard',
  failureRedirect: 'http://localhost:5173/'
}));

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
