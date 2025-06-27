const { google } = require('googleapis');
const path = require('path');
const EmailService = require('../services/emailService');
const UserService = require('../services/userService');
const TicketService = require('../services/ticketService');
const callOllamaWithRetries = require('./ollamaController');
const getOAuth2Client = require('../utils/googleClient');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

let currentPollingInterval = null;

function decodeBase64Email(data) {
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/'); // Gmail uses URL-safe base64
  const buff = Buffer.from(normalized, 'base64');
  return buff.toString('utf-8');
}

async function fetchPrimaryEmailsSince(user, timestamp, maxResults = 1000) {
  const auth = await getOAuth2Client(user);
  const gmail = google.gmail({ version: 'v1', auth });

  const query = `category:primary after:${timestamp}`;

  try {
    const resList = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = resList.data.messages || [];
    const emailList = [];

    for (const msg of messages) {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });

      const headers = full.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const sender = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';

      let body = '';
      const parts = full.data.payload.parts;
      if (parts && parts.length) {
        const textPart = parts.find(p => p.mimeType === 'text/plain');
        if (textPart?.body?.data) {
          body = decodeBase64Email(textPart.body.data);
        }
      } else if (full.data.payload.body?.data) {
        body = decodeBase64Email(full.data.payload.body.data);
      }

      emailList.push({
        subject,
        body,
        messageId: msg.id,
        internalDate: full.data.internalDate,
        sender
      });
    }

    return emailList;
  } catch (err) {
    console.error('❌ Error listing messages:', err.message);
    throw err;
  }
}

function stopPolling() {
  if (currentPollingInterval) {
    clearInterval(currentPollingInterval);
    currentPollingInterval = null;
    console.log('⛔ Email polling stopped.');
  }
}

async function startPolling(user, intervalMinutes = 1) {
  if (!user || !user.email) throw new Error('Invalid user object provided for polling.');

  if (isNaN(intervalMinutes) || intervalMinutes <= 0) {
    console.log('⚠️ Invalid interval provided, defaulting to 1 minute.');
    intervalMinutes = 1;
  }

  stopPolling();
  
  const intervalMs = intervalMinutes * 60 * 1000;
  let lastCheckTimestamp = Math.floor(Date.now() / 1000);

  console.log(`🚀 Starting email polling every ${intervalMinutes} minute(s)`);

  const pollEmails = async () => {
    console.log(`\n🔍 Polling for emails since ${new Date(lastCheckTimestamp * 1000).toISOString()}`);

    try {
      const newEmails = await fetchPrimaryEmailsSince(user, lastCheckTimestamp);
      await EmailService.saveNewEmails(user, newEmails);

      if (newEmails.length > 0) {
        console.log(`📨 Found ${newEmails.length} new email(s):`);
        for (const email of newEmails) {
          console.log(`  📧 Subject: "${email.subject}"`);
          console.log(`  🆔 ID: ${email.messageId}`);
          console.log(`  📝 Preview: ${email.body.substring(0, 100).replace(/\n/g, ' ')}...`);
          console.log('  ---');
        }

        const timestamps = newEmails.map(e => parseInt(e.internalDate)).filter(Boolean).map(t => Math.floor(t / 1000));
        if (timestamps.length > 0) {
          lastCheckTimestamp = Math.max(...timestamps) + 3;
        } else {
          lastCheckTimestamp = Math.floor(Date.now() / 1000);
        }

        console.log(`📅 Updated lastCheckTimestamp to ${new Date(lastCheckTimestamp * 1000).toISOString()}`);
      } else {
        console.log('📭 No new emails.');
        lastCheckTimestamp = Math.floor(Date.now() / 1000);
      }

    } catch (err) {
      console.error('❌ Error polling emails:', err.message);
    }

    try {
      const nextTime = new Date(Date.now() + intervalMs);
      console.log(`⏰ Next check at ${nextTime.toISOString()}\n`);
    } catch {
      console.log(`⏰ Next check in ${intervalMinutes} minute(s)\n`);
    }
  };

  await pollEmails();
  currentPollingInterval = setInterval(pollEmails, intervalMs);

  return {
    stop: stopPolling,
    isRunning: () => currentPollingInterval !== null,
  };
}

// Legacy fallback function
async function pollForNewEmails(intervalMs = 60000, user) {
  const intervalMinutes = intervalMs / 60000;
  return startPolling(user, intervalMinutes);
}

module.exports = {
  startPolling,
  stopPolling,
  pollForNewEmails,
  fetchPrimaryEmailsSince,
};
