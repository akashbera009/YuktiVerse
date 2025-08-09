import express from 'express';

import {generateShareLink , getSharedNotebook ,revokeShareLink , getUserSharedNotebooks} from  '../controllers/shareController.js';
// import { authenticateToken } from '../middleware/auth'; // Your auth middleware
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
// Generate share link for notebook (protected route)
// router.post('/notebook/:notebookId/generate', authenticateToken, shareController.generateShareLink);
router.post('/notebook/:notebookId/generate', authMiddleware ,generateShareLink);
 
// Revoke/delete share link (protected route)
router.delete('/notebook/:userId/:shareId', authMiddleware, revokeShareLink);

// Get all shared notebooks by user (protected route)
router.get('/user/notebooks/:userId', authMiddleware, getUserSharedNotebooks);



// Get shared notebook by share ID (public route)
router.get('/notebook/:shareId', getSharedNotebook);
// http://localhost:3000/api/share/notebook/72de6909c51f2408b0683cab0f56aab7


export default router;