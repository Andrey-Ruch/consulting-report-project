import { GoogleGenAI } from '@google/genai';

// Alias that tracks the current Flash release. The README's gemini-2.5-flash
// 404s for newer API keys ("no longer available to new users").
const MODEL = 'gemini-flash-latest';

let client: GoogleGenAI | null = null;

// Built lazily: dotenv.config() only runs when config/database.ts is imported,
// and server.ts imports the routes before the models, so reading the key at
// module scope can observe an undefined value.
const getClient = (): GoogleGenAI => {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  client = new GoogleGenAI({ apiKey });
  return client;
};

// The model occasionally wraps its whole answer in a markdown code fence, which
// would render as a literal code block instead of a report.
const stripCodeFence = (text: string): string => {
  const fenced = text.trim().match(/^```(?:markdown|md)?\n([\s\S]*)\n```$/);
  return fenced ? fenced[1].trim() : text.trim();
};

export const generateMarkdown = async (prompt: string): Promise<string> => {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking - cheaper, and enough for this task
      },
    },
  });

  const text = response.text;
  
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return stripCodeFence(text);
};
