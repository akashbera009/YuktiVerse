// pdfRoutes.js

import express from 'express';
import multer from 'multer';
import { summarizePDF } from '../controllers/pdfSummarizer.js';

const router = express.Router();
const upload = multer();

router.post('/summarize', upload.single('pdf'), summarizePDF);  

export default router;
