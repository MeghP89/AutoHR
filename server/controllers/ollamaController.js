const { Ollama } = require('ollama');
const { zodToJsonSchema } = require('zod-to-json-schema');
const mongoose = require('mongoose');
const User = require('../database/models/User');
const EmailService = require('../services/emailService');
const UserService = require('../services/userService');
const TicketService = require('../services/ticketService');
const { ticketSchema } = require('../schemas/ticket');
const connectDB = require('../database/index');
const Email = require('../database/models/Email');
const Ticket = require('../database/models/Ticket');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callOllamaWithRetries(emails, retries = 3, delay = 3000) {
    const tickets = [];
    for (const email of emails) {
        for (let i = 0; i < retries; i++) {
            try {
                const result = await generateTicket(email);
                if (result) {
                    tickets.push(result);
                    break; // Stop retrying this email if successful
                }
            } catch (err) {
                console.warn(`⚠️ Ollama fetch failed on attempt ${i + 1}: ${err.message}`);
                await sleep(delay);
            }
        }
    }
    TicketService.createTickets(tickets);
    return tickets;
}

async function generateTicket(email) {
    const ollama = new Ollama({ host: 'http://localhost:11434' });

  const prompt = `
You are an AI ticket analyst for a customer support system. Your task is to extract and generate exactly one JSON ticket object from the following email content:

Email: ${JSON.stringify(email, null, 2)}

The output should follow this structure and logic:

1. title: Write a clear, human-readable title summarizing the issue. 3–40 characters max. Avoid including sender name or full sentences.
2. summary: Provide a 1–3 sentence summary of what the email is about. Focus on the key problem or request. 10–500 characters.
3. intent: Choose a 3-letter code:
   - 'bug' = Bug report: When a feature is not working as expected.
   - 'req' = Feature request: When the user is asking for a new feature or improvement.
   - 'qna' = General question: When the user is asking a question or seeking information.
   - 'cmp' = Complaint: When the user is expressing dissatisfaction with the apps performance often involves negative language regarding the product.
   - 'oth' = Other: For any other type of inquiry or issue.
4. priority:
   - low, medium, high, urgent
5. suggestedSolution: Suggest what the user wants or how the issue could be solved (based on the email content). Keep it under 500 characters.
6. sender: Extract the sender's email from the metadata. If it's not available, use "unknown@example.com".

Respond ONLY with a single valid JSON object that matches this schema exactly. Do not include explanations or markdown.
`;

  console.log(`🔍 Generating ticket for email ID: ${email.messageId}`);

  try {
    const response = await ollama.chat({
      model: 'granite3.2:2b',
      messages: [{ role: 'user', content: prompt }],
      format: zodToJsonSchema(ticketSchema),
    });

    const raw = response.message.content;

    try {
      const parsed = JSON.parse(raw);
      const ticket = ticketSchema.parse(parsed);
      ticket.emailId = email.messageId; // Link the ticket to the email
      console.log(email.messageId);
      console.log(ticket);
      ticket.userId = email.userId; // Link the ticket to the user
      return ticket;
    } catch (err) {
      console.error('❌ Failed to parse or validate Ollama response:', err.message);
      console.error('↳ Raw content:', raw);
      return null;
    }
  } catch (err) {
    console.error('❌ Error calling Ollama:', err.message);
    return null;
  }
}

// (async () => {
//   const user = await UserService.getUserByEmail('test@example.com');
//   const emails = await EmailService.getEmailsByUserId(user._id);
//   const tickets = [];

//   for (const email of emails) {

//     const ticket = await callOllamaWithRetries(email);
//     if (ticket) {
//       console.log('✅ Generated Ticket:\n', ticket);
//       tickets.push(ticket);
//     }
//   }

//   await TicketService.createTickets(tickets);

//   mongoose.connection.close(); // Optional: close DB when done
// })();

module.exports = callOllamaWithRetries;
