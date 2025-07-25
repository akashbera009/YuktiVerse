// index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// import { getGeminiResponse } from './utils/geminiClient.js';

import geminiRoutes from './routes/gemini.js';
import pdfRoutes from './routes/pdfRoutes.js';
import handwrittenNotesRoutes from './routes/handwrittenNotes.js';

import notebooksRoutes from './routes/notebooks.js';
import yearRoutes from './routes/years.js';

// import resumeSummerizer from './routes/resumeSummerizer.js';

dotenv.config();

const app = express(); 

app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("YuktiVerse server is Live. go enjoy!!!");
});
app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
});


// genini routes 
app.use('/ai-help', geminiRoutes);


// pdf summerizer 
app.use('/api/pdf-summerize', pdfRoutes);   // /api/pdf/mcq

// handwritten notes
app.use('/api/handwritten-notes', handwrittenNotesRoutes);  

// ai notes 
app.use('/api/notebooks', notebooksRoutes);

// year dosument getting 
app.use('/years', yearRoutes);  // post: api/years

// app.use('/resume/summerize', resumeSummerizer) ; /resume/summarize [/upload-to-get-summary, /save-response, /get-saved-resume-analysis]





