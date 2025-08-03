// routes/handwrittenNotes.js
import express from 'express';
import upload from '../middlewares/multer.js';   // this uses diskStorage
// import multer from 'multer';
import { uploadNote, getHandWrittenNotes , renameNote ,  toggleImportantNote ,  deleteHandwrittenNote } from '../controllers/handwrittenNoteController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/notes/upload
router.post('/upload', protect, upload.single('file'), uploadNote);

// GET /api/notes
router.get('/', protect, getHandWrittenNotes);

router.patch('/:noteId/rename', renameNote);
router.patch('/:noteId/important', toggleImportantNote);

router.delete('/:id', deleteHandwrittenNote);

export default router;