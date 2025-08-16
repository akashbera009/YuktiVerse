// import express from 'express';
// import {
//   generateCodeFileShareLink,
//   getSharedCodeFile,
//   revokeCodeFileShareLink,
//   getUserSharedCodeFiles
// } from '../../controllers/codefile/codeFileShareController.js';

// import authMiddleware from '../../middlewares/authMiddleware.js';

// const router = express.Router();

// // Generate share link (protected)
// router.post('/codefile/:codeFileId/generate', authMiddleware, generateCodeFileShareLink);

// // Revoke share link (protected)
// router.delete('/codefile/:userId/:shareId', authMiddleware, revokeCodeFileShareLink);

// // Get all shared code files by user (protected)
// router.get('/user/codefiles/:userId', authMiddleware, getUserSharedCodeFiles);

// // Get shared code file by shareId (public)
// router.get('/codefile/:shareId', getSharedCodeFile);

// export default router;
