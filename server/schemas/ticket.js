const { z } = require('zod');

const ticketSchema = z.object({
    title: z.string().min(30, "Title must be at least 30 characters").max(40, "Title must be less than 40 characters"),
    summary: z.string().min(100, "Summary must be at least 100 characters").max(300, "Summary must be less than 500 characters"),
    intent: z.enum(['bug', 'req', 'qna', 'cmp', 'oth']),
    priority: z.enum(['low', 'medium', 'high', 'urgent'], { required_error: "Priority is required" }),
    suggestedSolution: z.string().max(500, "Suggested solution must be less than 500 characters"),
    sender: z.string().email("Invalid email format").max(100, "Email must be less than 100 characters"),
});

module.exports = {
    ticketSchema
};