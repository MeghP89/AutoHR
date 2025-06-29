const { google } = require('googleapis');
const SentEmail = require('../database/models/SentEmail');
const getOAuth2Client = require('../utils/googleClient');
require('dotenv').config({ path: require('path').resolve(__dirname, '../config/.env') });


/**
 * Sends an email using the Gmail API.
 * @param {object} user - The user object, containing credentials.
 * @param {object} email - The email object to be sent.
 * @param {string} email.recipient - The recipient's email address.
 * @param {string} email.subject - The email subject.
 * @param {string} email.body - The plain text body of the email.
 * @returns {Promise<object>} The response data from the Gmail API.
 */
async function sendEmail(user, email) {
  // Get an authorized OAuth2 client
  const auth = await getOAuth2Client(user);
  const gmail = google.gmail({ version: 'v1', auth });

  // Construct the raw email message in RFC 2822 format
  const rawMessage = [
    `To: ${email.recipient}`,
    `Subject: ${email.subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '', // Blank line separates headers from body
    email.body,
  ].join('\n');

  // Encode the message for the Gmail API (base64url)
  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Send the email via the API
  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log('✅ Email sent:', response.data.id);

  // Save a record of the sent email to the database
  const emailSent = new SentEmail(email);
  await emailSent.save();
  console.log('✅ Sent email record saved to database.');

  return response.data;
}

module.exports = {
  sendEmail,
};
