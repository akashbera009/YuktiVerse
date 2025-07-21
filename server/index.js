// index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import { getGeminiResponse } from './utils/geminiClient.js';
import pdfRoutes from './routes/pdfRoutes.js';
import handwrittenNotesRoutes from './routes/handwrittenNotes.js';

dotenv.config();

const app = express(); 

app.use(cors());
app.use(express.json());


// connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("hello server is responding ");
});

app.get('/get', (req, res) => {
  res.send("hello server is responding at get");
});

app.get('/ask-code', async (req, res) => {   // ask-code 
  const prompt = "explain sliding window";

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const response = await getGeminiResponse(prompt);
  res.send({ response });
});



app.use('/api/pdf', pdfRoutes);   // /api/pdf/mcq

app.use('/api/notes', handwrittenNotesRoutes);  // post:/api/notes/upload  || get:/api/notes



app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
});

