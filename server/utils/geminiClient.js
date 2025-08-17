///geminiClient.js

import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';


export const getGeminiResponse = async (prompt, task = '') => {
  try { 
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
