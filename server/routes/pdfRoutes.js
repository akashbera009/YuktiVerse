import express from 'express';
import multer from 'multer';
import { summarizePDF, generateMCQs, getAllPDFHistory, deletePdfById } from '../controllers/pdfController.js';
import { savePdfAllData } from '../controllers/savePdfAllData.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // ✅ Import authMiddlewareentication middleware

const router = express.Router();
const upload = multer();

// ✅ Protected routes — user must be logged in
router.post('/summarize', authMiddleware, upload.single('pdf'), summarizePDF);
router.post('/mcq', authMiddleware, generateMCQs);

// ✅ Save all PDF data linked to logged-in user
router.post('/save-all', upload.single('pdf'), authMiddleware, savePdfAllData);
    


// ✅ Get only the logged-in user's history
router.get('/history', authMiddleware, getAllPDFHistory);

// ✅ Delete only if it belongs to the logged-in user
router.delete('/delete/:id', authMiddleware, deletePdfById);

export default router;