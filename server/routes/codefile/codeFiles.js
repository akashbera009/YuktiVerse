import express from 'express';
import { createCodeFile,getCodeFileById ,updateCodeFile,deleteCodeFile ,renameCodeFile ,toggleImportant,shareCodeFile} from '../../controllers/codefile/codeFileController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createCodeFile);
router.get('/:_id', authMiddleware, getCodeFileById);
router.put('/:id', authMiddleware, updateCodeFile);
router.delete('/:id', authMiddleware, deleteCodeFile);
router.patch('/:id/rename', authMiddleware, renameCodeFile);
router.patch('/:id/important', authMiddleware, toggleImportant);
router.post('/:id/share', authMiddleware, shareCodeFile);
// router.get('/chapter/:chapterId', authMiddleware, getCodeFilesByChapter);
// router.get('/search/query', authMiddleware, CodeFileController.searchCodeFiles);
// router.get('/user/:userId/shared', authMiddleware, CodeFileController.getUserSharedCodeFiles);

export default router;
