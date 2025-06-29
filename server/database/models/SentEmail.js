const mongoose = require('mongoose');

const SentEmailSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    }
}, {
    collection: 'SentEmail'
});

module.exports = mongoose.model('SentEmail', SentEmailSchema);
