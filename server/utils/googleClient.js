const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

async function getOAuth2Client(user) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set only the access token
  oauth2Client.setCredentials({
    access_token: user.accessToken
  });

  return oauth2Client;
}

module.exports = getOAuth2Client;
