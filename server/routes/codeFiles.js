// routes/codeFiles.js
import express from ('express');
const CodeFileController = require('../controllers/codeFileController');
router = express.Router();

// Create new code file
router.post('/', CodeFileController.createCodeFile);

// Get code file by ID
router.get('/:id', CodeFileController.getCodeFile);

// Update code file
router.put('/:id', CodeFileController.updateCodeFile);

// Delete code file
router.delete('/:id', CodeFileController.deleteCodeFile);

// Get all code files for a chapter
router.get('/chapter/:chapterId', CodeFileController.getCodeFilesByChapter);

// Rename code file
router.patch('/:id/rename', CodeFileController.renameCodeFile);

// Toggle important status
router.patch('/:id/important', CodeFileController.toggleImportant);

// Share code file
router.post('/:id/share', CodeFileController.shareCodeFile);

// Search code files
router.get('/search/query', CodeFileController.searchCodeFiles);

// Get user's shared code files
router.get('/user/:userId/shared', CodeFileController.getUserSharedCodeFiles);

module.exports = router;

// routes/share.js (add to existing share routes)
const express = require('express');
const CodeFileController = require('../controllers/codeFileController');
const router = express.Router();

// Get shared code file
router.get('/code/:shareId', CodeFileController.getSharedCodeFile);

// Revoke code file sharing
router.delete('/code/:userId/:shareId', CodeFileController.revokeSharing);

module.exports = router;