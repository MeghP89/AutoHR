const { z } = require('zod');

const sendEmailSchema = z.object({
    subject: z.string(),
    body: z.string()
})

module.exports = { sendEmailSchema };