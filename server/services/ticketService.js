const Ticket = require('../database/models/Ticket');
const EmailService = require('./emailService');

class TicketService {
    async createTickets(tickets) {
        const newTickets = [];

        for (const ticket of tickets) {
            try {
                const existing = await Ticket.findOne({ emailId: ticket.emailId });

                if (!existing) {
                    newTickets.push(ticket);
                } else {
                    console.log(`ℹ️ Ticket already exists: ${ticket.title}`);
                    await EmailService.markEmailAsTicketCreated(ticket.emailId);
                }
            } catch (error) {
                console.error('❌ Error checking ticket existence:', error.message);
            }
        }

        if (newTickets.length > 0) {
            try {
                const inserted = await Ticket.insertMany(newTickets);
                console.log(`✅ Inserted ${inserted.length} new tickets.`);

                return inserted;
            } catch (error) {
                console.error('❌ Error inserting tickets:', error.message);
            }
        } else {
            console.log('ℹ️ No new tickets to insert.');
        }

        return newTickets;
    }
    async getTicketById(ticketId) {
        return await Ticket.findById(ticketId);
    }
    async getTicketsByEmailId(emailId) {
        return await Ticket.find({ emailId }).sort({ createdAt: -1 });
    }
    async getTicketsByUserId(userId) {
        return await Ticket.find({ userId }).sort({ createdAt: -1 });
    }
    async updateTicket(ticketId, updateData) {
        try {
            const updatedTicket = await Ticket.findByIdAndUpdate(
                ticketId,
                updateData,
                { new: true }
            );

            if (!updatedTicket) {
                console.warn(`⚠️ No ticket found with ID: ${ticketId}`);
            } else {
                console.log(`✅ Ticket updated: ${updatedTicket.title}`);
            }

            return updatedTicket;
        } catch (error) {
            console.error(`❌ Failed to update ticket ${ticketId}:`, error.message);
            throw error;
        }
    }


    async deleteTicket(ticketId) {
        return await Ticket.findByIdAndDelete(ticketId);
    }
}

module.exports = new TicketService();
