// geminiController.js - Simplified without authentication
import { getGeminiResponse } from '../utils/geminiClient.js';
import Notebook from '../models/NoteBook.js'; // ✅ Add this import
import connectDB from '../config/db.js'; // ✅ Add this import (adjust path as needed)
import mongoose from 'mongoose';

const createGeminiHandler = (task) => {
  return async (req, res) => {
    try {
      console.log('Received req.body:', req.body);
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

import removeMd from "remove-markdown";

const createCacheableGeminiHandler = (task) => {
  
  return async (req, res) => {
    try {
      console.log("fund ");
      await connectDB();

      console.log("Received req.body:", req.body);
      const { prompt, textBoxId, notebookId, forceRefresh = false } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // ✅ If notebook + textbox provided, try cache
      if (textBoxId && notebookId) {
        console.log(`Processing cache request for notebook: ${notebookId}, textBox: ${textBoxId}`);

        if (!forceRefresh) {
          try {
            const existingNotebook = await Notebook.findOne(
              {
                _id: new mongoose.Types.ObjectId(notebookId),
                "content.textBoxes.id": textBoxId,
              },
              { "content.textBoxes.$": 1 }
            );

            if (existingNotebook) {
              const existingTextBox = existingNotebook.content?.textBoxes?.[0];
              if (existingTextBox?.airesponse?.trim()) {
                console.log(`Returning cached AI response for textBox: ${textBoxId}`);
                return res.json({
                  task,
                  response: existingTextBox.airesponse,
                  fromCache: true,
                });
              }
            }
          } catch (err) {
            console.error("Cache lookup error:", err);
          }
        }

        // No cache hit → Call Gemini
        console.log("Calling Gemini API for new response...");
        let response = await getGeminiResponse(prompt, task);
console.log(response);

        // 🧹 Remove markdown formatting
        response = removeMd(response || "").trim();

        if (task.includes("short explainer")) {
          response = response
            .split(/(?<=[.?!])\s+/)
            .slice(0, 2)
            .join(" ")
            .split(" ")
            .slice(0, 40)
            .join(" ");
        }

        try {
          const updateResult = await Notebook.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(notebookId),
              "content.textBoxes.id": textBoxId,
            },
            { $set: { "content.textBoxes.$.airesponse": response } },
            { new: true }
          );

          if (!updateResult) {
            const byId = await Notebook.findById(notebookId).lean();
            if (!byId) {
              console.warn(`[Cache Update] Notebook not found for _id: ${notebookId}.`);
            } else {
              console.warn(
                `[Cache Update] No matching textBox for id: ${textBoxId}. Existing IDs:`,
                byId.content?.textBoxes?.map((tb) => tb.id)
              );
            }
            return res.json({ task, response, fromCache: false, cached: false });
          }

          console.log(`AI response cached successfully for textBox: ${textBoxId}`);
          return res.json({ task, response, fromCache: false, cached: true });
        } catch (updateError) {
          console.error("Database update error:", updateError);
          return res.json({ task, response, fromCache: false, cached: false });
        }
      }

      // ✅ No caching params → Call Gemini normally
      console.log("No caching parameters provided, using default behavior");
      let response = await getGeminiResponse(prompt, task);

      // 🧹 Remove markdown formatting
      response = removeMd(response || "").trim();

      res.json({ task, response });
    } catch (error) {
      console.error(`Gemini API Error [${task}]:`, error);
      res.status(500).json({ error: `Failed to handle task: ${task}` });
    }
  };
};



export const resumeAnalysis = async (req, res) => {
  try {

    const pdfParse = (await import("pdf-parse")).default;
    const mammoth = await import("mammoth");
    const path = await import("path");

    const file = req.file;
    console.log("file is ", file);

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(file.originalname).toLowerCase();
    let extractedText = "";

    if (ext === ".pdf") {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    const prompt = `
    You are an expert resume analyzer.
    
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
        """
        ${extractedText}
        """`;

    const response = await getGeminiResponse(prompt, extractedText);
    let text = response;
    // console.log("this is resposmse ", response);

    text = text.replace(/```json|```/g, "").trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(text);
    } catch (parseErr) {
      return res.status(500).json({
        message: "Gemini returned invalid JSON",
        error: parseErr.message,
        raw: text,
      });
    }

    // 👇 Return buffer as base64 string so frontend can reuse it for /save
    return res.status(200).json({
      message: "Analysis complete",
      analysis: parsedJson,
      userId: req.user.id,
      fileInfo: {
        filename: file.originalname,
        buffer: file.buffer.toString('base64'),
        mimetype: file.mimetype
      }
    });
  } catch (err) {
    console.error("❌ Error during analysis:", err);
    return res.status(500).json({
      message: "Analysis failed",
      error: err.message
    });
  }
};






// Export specific handlers for each task
export const askCode = createGeminiHandler(
  "Generate a good and easy code for this topic with example, be precise."
);

export const mcqGen = createGeminiHandler(
  "Generate 5 multiple choice questions with answers based on this topic."
);

// Use the cacheable handler for shortExplain
export const shortExplain = createCacheableGeminiHandler(`You are to act as a short explainer.
Explain the topic in exactly 1 plain sentences, under 40 words.
Never ask clarifying questions.
Never list options or give bullet points.
Never request more context.
Only output the explanation text.`);

export const detailedExplain = createGeminiHandler(
  "Explain this topic in detail with examples."
);

export const simpleChat = createGeminiHandler(
  "please tell "
);

// // Optional: You can also make other handlers cacheable if needed
// export const detailedExplainCacheable = createCacheableGeminiHandler(
//   "Explain this topic in detail with examples."
// );