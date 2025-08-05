///geminiClient.js

import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
// const GEMINI_API_URL = 'https://m.facebook.com/story.php?story_fbid=pfbid07GcWaxDU9dyTXbuh1pwEk3oLiUTY6RU3hTZMQcP9FgUkMp9K1cqSc36iNYPe4D3Cl&id=61555795563182&mibextid=6aamW6';


export const getGeminiResponse = async (prompt, task = '') => {
  try {
      console.log("🧪 Gemini Prompt:", prompt);
    console.log("🧪 Task Context:", task);
    // Combine task instruction with the prompt
    const finalPrompt = task ? `${task}\n\n${prompt}` : prompt;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: finalPrompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
    return generatedText || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    return 'Error fetching response from Gemini.';
  }
};
