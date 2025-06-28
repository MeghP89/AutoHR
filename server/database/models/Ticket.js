const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    summary: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    intent: {
        type: String,
        enum: ['bug', 'req', 'qna', 'cmp', 'oth'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        required: true
    },
    suggestedSolution: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open',
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    collection: 'Tickets',
});

module.exports = mongoose.model('Ticket', ticketSchema);
