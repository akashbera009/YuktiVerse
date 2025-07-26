// routes/years.js



import express from 'express';
import {
  createYear,
  listYears,
  addSubject,
  listSubjects,
  addChapter,
  listChapters,
  getMaterialsByChapter
} from '../controllers/yearController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

// Year
router.post('/', createYear);
router.get('/', listYears);

// Subject
router.post('/:yearId/subjects', addSubject);
router.get('/:yearId/subjects', listSubjects);

// Chapter
router.post('/subjects/:subjectId/chapters', addChapter);
router.get('/subjects/:subjectId/chapters', listChapters);

// Resource
router.get('/:chapterId/materials', getMaterialsByChapter);


export default router;
