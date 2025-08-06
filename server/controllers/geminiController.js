import { getGeminiResponse } from '../utils/geminiClient.js';

const createGeminiHandler = (task) => {
  return async (req, res) => {  

    
    try {
      console.log('Received req.body:', req.body); // Add this lin
      const { prompt } = req.body;
      console.log(prompt, task);
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const response = await getGeminiResponse(prompt, task);
      res.json({ task, response });
    } catch (error) {
      console.error(`Gemini API Error [${task}]:`, error);
      res.status(500).json({ error: `Failed to handle task: ${task}` });
    }
  };
};

// Export specific handlers for each task
export const askCode = createGeminiHandler(
  "Generate a good and easy code for this topic with example, be precise."
);

export const mcqGen = createGeminiHandler(
  "Generate 5 multiple choice questions with answers based on this topic."
);

export const resumeAnalysis = createGeminiHandler(
  `You are an expert resume analyzer.

    Analyze the following resume content and return a clean JSON object with the following fields:

    {
    "strengths": [ "..." ],
    "issues": [ "..." ],
    "suggestions": [ "..." ],
    "recommendedRoles": [ "..." ],
    "scorecard": {
        "clarity": 0-10,
        "formatting": 0-10,
        "relevance": 0-10,
        "totalFitScore": 0-100
    }
    }

    ONLY return valid JSON. No explanation, no code block.

    Resume Content:
  `
);

export const shortExplain = createGeminiHandler(
  "Explain this topic in 3-4 concise sentences."
);

export const detailedExplain = createGeminiHandler(
  "Explain this topic in detail with examples."
);
export const simpleChat = createGeminiHandler(
  "please tell "
);

// text, "Summarize the following content
