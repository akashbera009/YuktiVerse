import express from 'express';
import { protect } from '../middlewares/auth.js';
import { createNotebook, getNotebookById, updateNotebook } from '../controllers/notebookController.js';

const router = express.Router();

// POST /api/notebooks
router.post('/', protect, createNotebook);   // http://localhost:3000/api/notebooks/
// router.post('/', createNotebook);


router.get('/:id', protect, getNotebookById);  // http://localhost:3000/api/notebooks/math-note-4

router.put('/:id', protect, updateNotebook);   // http://localhost:3000/api/notebooks/math-note-4


// GET  /api/notebooks
// router.get('/',  protect, getNotebooks);
// router.get('/', getNotebooks);


export default router;
