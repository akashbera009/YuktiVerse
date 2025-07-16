// index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import { getGeminiResponse } from './utils/geminiClient.js';
import pdfRoutes from './routes/pdfRoutes.js';

dotenv.config();

const app = express(); 

app.use(cors());
app.use(express.json());


app.use('/api/pdf', pdfRoutes);

// connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("hello server is responding ");
});

app.get('/get', (req, res) => {
  res.send("hello server is responding at get");
});

app.get('/ask-code', async (req, res) => {
  const prompt = "explain sliding window";

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const response = await getGeminiResponse(prompt);
  res.send({ response });
});

app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
});

