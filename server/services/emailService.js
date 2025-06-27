const Email = require('../database/models/Email');
const callOllamaWithRetries = require('../controllers/ollamaController');
const { gmail } = require('googleapis/build/src/apis/gmail');

class EmailService {
  async saveNewEmails(user, gmailEmails) {
    const savedEmails = [];

    for (const gmailEmail of gmailEmails) {
      try {
        const existing = await Email.findOne(
          { body: gmailEmail.body },
        );

        if (!existing) {
          gmailEmail.userId = user._id; // Link the email to the user
          gmailEmail.messageId = gmailEmail.messageId || gmailEmail.id; // Ensure messageId is set
          savedEmails.push(gmailEmail); // Only push if inserted
          console.log(`✅ Email saved: ${gmailEmail.subject}`);
        } else {
          console.log(`ℹ️ Email already exists: ${gmailEmail.subject}`);
        }
      } catch (error) {
        console.error('❌ Error saving email:', error.message);
      }
    }
    if (savedEmails.length > 0) {
      try {
        await Email.insertMany(savedEmails);
        console.log(`✅ Inserted ${savedEmails.length} new emails.`);
        let createdTickets = await callOllamaWithRetries(savedEmails);
        for(const ticket of createdTickets) {
          await this.markEmailAsTicketCreated(ticket.emailId);
        }
        console.log(`✅ Created ${createdTickets.length} tickets from emails.`);
      } catch (error) {
        console.error('❌ Error calling Ollama:', error.message);
      }
    }

    return savedEmails;
  }

  async getEmailsByUserId(userId) {
    try {
      const emails = await Email.find({userId: userId, ticketCreated: false}).sort({ receivedAt: -1 }).exec();
      return emails;
    } catch (error) {
      console.error('❌ Error fetching emails for user:', error.message);
      throw error;
    }
  }

  async markEmailAsTicketCreated(emailId) {
    try {
      const result = await Email.updateOne(
        { messageId: emailId },
        { $set: { ticketCreated: true } }
      );
      return result;
    } catch (error) {
      console.error('❌ Error marking email as ticket created:', error.message);
      throw error;
    }
  }
}


module.exports = new EmailService();
