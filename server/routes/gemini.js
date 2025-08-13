import express from 'express';
import upload from '../middlewares/uploadResume.js';
import { askCode, mcqGen, resumeAnalysis, shortExplain, detailedExplain, simpleChat } from '../controllers/geminiController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/ask-code', askCode);
router.post('/mcq-gen', mcqGen);
router.post('/resume-analysis',authMiddleware,  upload.single('resume'),resumeAnalysis);
router.post('/short-explain', shortExplain);
router.post('/detailed-explain', detailedExplain);
router.post('/simple-chat', simpleChat);

export default router;
    