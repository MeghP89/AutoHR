const { Ollama } = require('ollama');
const { zodToJsonSchema } = require('zod-to-json-schema');
const UserService = require('../services/userService');
const TicketService = require('../services/ticketService');
const { ticketSchema } = require('../schemas/ticket');
const { sendEmailSchema } = require('../schemas/sendingEmail');
// Corrected import: Uses destructuring {} to get the named 'sendEmail' export.
const { sendEmail } = require('../services/gmailService');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callOllamaWithRetries(emails, retries = 3, delay = 3000) {
  const tickets = [];
  for (const email of emails) {
    await sleep(2000)
    for (let i = 0; i < retries; i++) {
      try {
        const result = await generateTicket(email);
        if (result != null) {
          tickets.push(result);
          break; // Stop retrying this email if successful
        }
      } catch (err) {
        console.warn(`⚠️ Ollama fetch failed on attempt ${i + 1}: ${err.message}`);
        await sleep(delay);
      }
    }
  }
  await TicketService.createTickets(tickets);
  return tickets;
}

async function generateTicket(email) {
  const ollama = new Ollama({ host: 'http://localhost:11434' });

  const prompt = `
You are an AI ticket analyst for a customer support system. Your task is to extract and generate exactly one JSON ticket object from the following email content:

Email: ${JSON.stringify(email, null, 2)}

The output should follow this structure and logic:

1. title: Write a clear, human-readable title summarizing the issue. 3–40 characters max. Avoid including sender name or full sentences. Should be short and specific.
2. summary: Provide a 1–3 sentence summary of what the email is about. Focus on the key problem or request. 10–500 characters. All important details should be fed into the summary.
3. intent: Choose a 3-letter code:
   - 'bug' = Bug report: When a feature is not working as expected.
   - 'req' = Feature request: When the user is asking for a new feature or improvement.
   - 'qna' = General question: When the user is asking a question or seeking information.
   - 'cmp' = Complaint: When the user is expressing dissatisfaction with the apps performance often involves negative language regarding the product.
   - 'oth' = Other: For any other type of inquiry or issue.
4. priority:
   - low  = Asking a general question that doesn’t require a quick response.
   - medium = Requesting assistance or clarification needed within a few days.
   - high = Reporting an issue affecting an employee, customer, or workflow that needs attention soon.
   - urgent = Escalating a time-sensitive or serious problem that requires immediate HR action.
5. suggestedSolution: Suggest what the user wants or how the issue could be solved (based on the email content). Keep it under 500 characters.
6. sender: Extract the sender's email from the metadata. If it's not available, use "unknown@example.com".
7. spam: Set to true if the email is: **irrelevant to work** or customers, or includes jokes, promotions, or random links — don’t send it to HR.

Respond ONLY with a single valid JSON object that matches this schema exactly. Do not include explanations or markdown.
`;

  console.log(`🔍 Generating ticket for email ID: ${email.messageId}`);

  try {
    const response = await ollama.chat({
      model: 'granite3.2:8b',
      messages: [{ role: 'user', content: prompt }],
      format: zodToJsonSchema(ticketSchema),
    });

    const raw = response.message.content;

    try {
      const parsed = JSON.parse(raw);
      const ticket = ticketSchema.parse(parsed);

      if (ticket.spam) return null;

      ticket.emailId = email.messageId;
      ticket.userId = email.userId;
      delete ticket.spam;

      console.log(email.messageId, ticket);
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

async function createEmail(ticket) {
  const user = await UserService.getUserById(ticket.userId);
  if (!user) {
    console.error('❌ User not found for ID:', ticket.userId);
    return null;
  }

  const ollama = new Ollama({ host: 'http://localhost:11434' });

  const prompt = `You are an HR team AI assistant responding to a user's email inquiry or problem.
You are currently responding on behalf of ${user.email || user.id || 'an HR representative'}, so take their identity in your response.
Given the ticket content:
Ticket: ${JSON.stringify(ticket, null, 2)}
Instructions:
- Respond as an HR representative, acknowledging the user's problem or request.
- Utilize the suggested solution and relevantUserinfo in crafting your response.
- The subject should briefly summarize the reply’s purpose.
- The body should be a clear, polite, and relevant email reply to the user's email content.
- Do not add any explanations or extra text; respond with only the JSON object.`;

  console.log(`🔍 Send email for ticket ID: ${ticket._id}`);

  try {
    const response = await ollama.chat({
      model: 'granite3.2:8b',
      messages: [{ role: 'user', content: prompt }],
      format: zodToJsonSchema(sendEmailSchema),
    });

    const raw = response.message.content;

    try {
      const parsed = JSON.parse(raw);
      const sentEmail = sendEmailSchema.parse(parsed);

      sentEmail.ticketId = ticket._id;
      sentEmail.recipient = ticket.sender;

      console.log('📧 Prepared email:', sentEmail);

      const res = await sendEmail(user, sentEmail);
      return res;
    } catch (err) {
      // Updated the error message to be more specific.
      console.error('❌ Failed to send email or process the AI response:', err.message);
      console.error('↳ Raw content:', raw);
      return null;
    }
  } catch (err) {
    console.error('❌ Error calling Ollama:', err.message);
    return null;
  }
}

module.exports = {
  callOllamaWithRetries,
  createEmail,
};
