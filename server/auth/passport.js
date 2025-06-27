const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const User = require('../database/models/User'); // Assuming this path is correct
const FederatedCredential = require('../database/models/FederatedCredentials'); // Assuming this path is correct
// It's better to handle user creation/updates within this file or a dedicated auth service
// rather than a generic UserService, to keep token logic together.

require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
    // These two settings are crucial for getting a refresh token.
    accessType: 'offline',
    prompt: 'consent',
    approvalPrompt: 'force'
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        const provider = 'google';

        // Find the credential associated with this Google profile ID
        let cred = await FederatedCredential.findOne({ provider: provider, subject: profile.id });

        console.log('Google profile:', profile);
        console.log('Access Token:', accessToken);
        // IMPORTANT: The refresh token is only sent on the *first* authorization.
        // If it's undefined here, the user has likely authorized the app before.
        // To get a new one, the user MUST revoke access at: https://myaccount.google.com/permissions
        console.log('Refresh Token:', refreshToken);

        if (!cred) {
            // --- This is a new user ---

            // Create a new user object
            const newUser = new User({
                name: profile.displayName,
                email: profile.emails?.[0]?.value || '',
                googleId: profile.id,
                accessToken: accessToken,
                // Only store the refresh token if we receive it.
                // The User schema must be defined to accept a String for refreshToken.
                // Example User Schema: refreshToken: { type: String }
                refreshToken: refreshToken
            });
            await newUser.save();

            // Create the federated credential to link the user account to the Google provider
            const newCred = new FederatedCredential({
                provider: provider,
                subject: profile.id,
                userId: newUser._id
            });
            await newCred.save();

            // Pass the newly created user to the callback
            return cb(null, newUser);

        } else {
            // --- This is a returning user ---

            // Find the user associated with this credential
            const user = await User.findById(cred.userId);
            if (!user) {
                // This case is unlikely but good to handle: a credential exists without a user.
                return cb(new Error('Federated credential found, but corresponding user does not exist.'));
            }

            // Update the user's access token
            user.accessToken = accessToken;

            // IMPORTANT: If a new refresh token was provided, update it.
            // Google often doesn't send a new one on subsequent logins, so we only update if it exists.
            if (refreshToken) {
                user.refreshToken = refreshToken;
            }

            await user.save();

            // Pass the updated user to the callback
            return cb(null, user);
        }
    } catch (err) {
        return cb(err);
    }
}));

// Session management - serialize user ID into the session
passport.serializeUser((user, cb) => {
    // We are storing the user's MongoDB _id in the session
    process.nextTick(() => {
        cb(null, user.id);
    });
});

// Deserialize user from the session using the ID
passport.deserializeUser(async (id, cb) => {
    try {
        // Find the user by their MongoDB _id
        const user = await User.findById(id);
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

module.exports = passport;
