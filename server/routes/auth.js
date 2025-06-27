const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login/federated/google', passport.authenticate('google'), async (req, res) => {
    // This route will redirect to Google's OAuth 2.0 server
  // The user will be redirected back to the redirect URI after authentication
  res.redirect('/api/emails');
});

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/api/emails',
  failureRedirect: '/'
}));

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
