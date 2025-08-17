// pdfSummarizer.js


import pdfParse from 'pdf-parse';
import { getGeminiResponse } from '../utils/geminiClient.js';

export const summarizePDF = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;  // ✅ From uploaded file
    const data = await pdfParse(pdfBuffer);  // ✅ Parses text from buffer
    const text = data.text;
 
    const summary = await getGeminiResponse(text, "Summarize the following content");

    res.json({ summary });
  } catch (error) {
    console.error('PDF Summary Error:', error.message);
    res.status(500).json({ error: 'Failed to summarize PDF' });
  }
};
