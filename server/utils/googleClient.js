const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

async function getOAuth2Client(user) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set both tokens if available
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken // Only useful if you have it
  });

  // Attempt to refresh access token if refresh token exists
  if (user.refreshToken) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken(); // deprecated but still works
      oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token || user.refreshToken
      });
    } catch (error) {
      console.error('🔴 Error refreshing access token:', error.message);
    }
  }

  return oauth2Client;
}

module.exports = getOAuth2Client;
