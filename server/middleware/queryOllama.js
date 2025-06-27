const { z } = require('zod');
const { Ollama } = require('ollama');
const { zodToJsonSchema } = require('zod-to-json-schema');
const { QuestsArraySchema, QuestSchema } = require('../schemas/Quest'); 

// NEW: Schema for an array of quests



const ollama = new Ollama({ host: 'http://localhost:11434' });

async function queryOllama(focuses) {

  try {
    const prompt = `Generate **three distinct quests** in JSON array format. Each quest must adhere to the following rules:
        - Quest must be completable in **one day**.
        - **Title:** Concise, quest-like.
        - **Description:** Short, concise, specific to quest.
        - **Task:** Specific, actionable task that is quantifiable (must include a number).
        - **MaxProgress:** The quantifianble number in the task (e.g., 1 for workout, 5 for 5 conversations).
        - **Reward Type/Type:** This type must be aligned with the purpose of the quest.
        - **Difficulty:** This should be judged based on the task's complexity and effort required.
        - Base quest on these focuses: ${focuses.join(', ')}.
        - Each quest object in the array must **strictly follow** this schema (excluding the 'value' field in 'reward', which your code will calculate):
${JSON.stringify(zodToJsonSchema(QuestSchema), null, 2)}`;

    console.log("Running the ollama chat")
    const response = await ollama.chat({
      model: 'gemma3:4b',
      messages: [{ role: 'user', content: prompt }],
      format: zodToJsonSchema(QuestsArraySchema), // Use the new schema for validation
    });

    const rawResponseContent = response.message.content;
    console.log('✅ Raw Ollama Response:\n', rawResponseContent);

    let parsedQuestsArray;
    try {
      parsedQuestsArray = JSON.parse(rawResponseContent);
    } catch (jsonError) {
      console.error('❌ Error parsing JSON from Ollama response:', jsonError.message);
      console.error('Raw content that failed to parse:', rawResponseContent);
      return null;
    }

    // Validate the parsed array against the QuestsArraySchema
    const validatedQuestsArray = QuestsArraySchema.parse(parsedQuestsArray);

    // Now, apply the XP value for each quest in the array
    const finalQuests = validatedQuestsArray.map(quest => ({
      ...quest,
      reward: {
        ...quest.reward,
        value: difficultyXpMap[quest.difficulty] || 0, // Fallback to 0 if difficulty not found
      }
    }));

    console.log('✅ Final Validated Quests with XP:\n', JSON.stringify(finalQuests, null, 2));
    return finalQuests;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('❌ Zod Validation Error:', err.errors);
    } else {
      console.error('❌ Error querying Ollama:', err.message);
    }
    return null;
  }
}

// module.exports = queryOllama;

queryOllama(['Social', 'Focus', 'Physical'])