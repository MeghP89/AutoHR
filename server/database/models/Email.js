const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      default: 'No Subject',
    },
    body: {
      type: String,
      default: '',
    },
    sender: {
      type: String,
      required: true, // Email address of the sender
    },
    messageId: {
      type: String,
      required: true,
      unique: true, // prevents duplicates
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    ticketCreated: {
      type: Boolean,
      default: false, // Indicates if a ticket has been created for this email
    }
  },
  {
    collection: 'Emails',
  }
);

module.exports = mongoose.model('Email', emailSchema);
