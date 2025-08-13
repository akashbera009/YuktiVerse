
// routes/resumeRoutes.js
import express from 'express';
import upload from '../middlewares/uploadResume.js';
import { analyzeResume } from '../controllers/resumeAnalyzeController.js';
import { deleteResume, getAllResumes, saveResumeToDB } from '../controllers/resumeController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // ✅ Add authMiddleware middleware

const router = express.Router();

// Analyze resume (no saving, just AI output) — still requires authMiddleware
// router.post('/analyze', authMiddleware, upload.single('resume'), analyzeResume);

// Save resume to DB with file upload — requires authMiddleware
router.post('/save', authMiddleware, upload.single('resume'), saveResumeToDB);

// Get all resumes for the logged-in user
router.get('/all', authMiddleware, getAllResumes);

// Delete resume by ID — requires authMiddleware
router.delete('/delete/:id', authMiddleware, deleteResume);

export default router;