 
 import express from 'express';
 const router = express.Router();
import {
  createCodeFile,
  getCodeFileById,
  getAllCodeFiles,
  updateCodeFile,
  deleteCodeFile,
  renameCodeFile,
  toggleImportant,
  shareCodeFile,
  getSharedCodeFile,
  forkCodeFile,
  searchCodeFiles,
  runCode , 
  generateCodingQuestion, verifyCode
}  from '../controllers/codeFileController.js';
 import authMiddleware from '../middlewares/authMiddleware.js';

// Public routes
router.get('/shared/:shareUrl', getSharedCodeFile);

// Protected routes
router.use(authMiddleware);

// CRUD operations
router.post('/', createCodeFile);
router.get('/', getAllCodeFiles);
router.get('/:id', getCodeFileById);
router.put('/:id', updateCodeFile);
router.delete('/:fileId', deleteCodeFile);
router.post('/run', runCode);

// Specific actions
router.patch('/:fileId/rename', renameCodeFile);
router.patch('/:fileId/important', toggleImportant);
router.post('/:id/share', shareCodeFile);
router.post('/:id/fork', forkCodeFile);



router.post("/coding", generateCodingQuestion);
router.post("/verify-code", verifyCode);

// Search
router.get('/search/:query', searchCodeFiles);

export default router;
