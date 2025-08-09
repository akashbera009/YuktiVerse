import express from 'express';
import authMiddleware  from '../middlewares/authMiddleware.js';
import { createNotebook, getNotebookById, updateNotebook , renameNotebook  , toggleImportantNotebook , deleteNotebook} from '../controllers/notebookController.js';

const router = express.Router();

// POST /api/notebooks
router.post('/', authMiddleware, createNotebook);   // http://localhost:3000/api/notebooks/
// router.post('/', createNotebook);


router.get('/:id', authMiddleware, getNotebookById);  // http://localhost:3000/api/notebooks/math-note-4

router.put('/:id', authMiddleware, updateNotebook);   // http://localhost:3000/api/notebooks/math-note-4

router.patch('/:noteId/rename', renameNotebook);
router.patch('/:noteId/important', toggleImportantNotebook);

router.delete('/:id', deleteNotebook);
// GET  /api/notebooks
// router.get('/',  protect, getNotebooks);
// router.get('/', getNotebooks);


export default router;
