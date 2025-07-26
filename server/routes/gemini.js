import express from 'express';
import { askCode, mcqGen, resumeAnalysis, shortExplain, detailedExplain } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/ask-code', askCode);
router.post('/mcq-gen', mcqGen);
router.post('/resume-analysis', resumeAnalysis);
router.post('/short-explain', shortExplain);
router.post('/detailed-explain', detailedExplain);

export default router;
