// controllers/codeFileController.js
const CodeFile = require('../models/CodeFile');
const Chapter = require('../models/Chapter');
const mongoose = require('mongoose');

class CodeFileController {
  // Create new code file
  static async createCodeFile(req, res) {
    try {
      const { title, content = '', language = 'javascript', description = '', tags = [], chapterId } = req.body;

      if (!title || !chapterId) {
        return res.status(400).json({ 
          error: 'Title and chapter ID are required' 
        });
      }

      // Verify chapter exists
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      const codeFile = new CodeFile({
        title: title.trim(),
        content,
        language,
        description,
        tags: Array.isArray(tags) ? tags : [],
        chapter: chapterId,
        // createdBy: req.user?.id // uncomment when auth is implemented
      });

      await codeFile.save();
      
      // Populate chapter info for response
      await codeFile.populate('chapter', 'title');

      res.status(201).json({
        success: true,
        data: codeFile
      });
    } catch (error) {
      console.error('Error creating code file:', error);
      res.status(500).json({ 
        error: 'Failed to create code file',
        details: error.message 
      });
    }
  }

  // Get code file by ID
  static async getCodeFile(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid code file ID' });
      }

      const codeFile = await CodeFile.findById(id).populate('chapter', 'title');
      
      if (!codeFile) {
        return res.status(404).json({ error: 'Code file not found' });
      }

      res.json({
        success: true,
        data: codeFile
      });
    } catch (error) {
      console.error('Error fetching code file:', error);
      res.status(500).json({ 
        error: 'Failed to fetch code file',
        details: error.message 
      });
    }
  }

  // Update code file
  static async updateCodeFile(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid code file ID' });
      }

      // Remove fields that shouldn't be updated directly
      delete updates._id;
      delete updates.createdAt;
      delete updates.shareId;

      const codeFile = await CodeFile.findByIdAndUpdate(
        id,
        { ...updates, lastModified: new Date() },
        { new: true, runValidators: true }
      ).populate('chapter', 'title');

      if (!codeFile) {
        return res.status(404).json({ error: 'Code file not found' });
      }

      res.json({
        success: true,
        data: codeFile
      });
    } catch (error) {
      console.error('Error updating code file:', error);
      res.status(500).json({ 
        error: 'Failed to update code file',
        details: error.message 
      });
    }
  }

  // Delete code file
  static async deleteCodeFile(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid code file ID' });
      }

      const codeFile = await CodeFile.findByIdAndDelete(id);

      if (!codeFile) {
        return res.status(404).json({ error: 'Code file not found' });
      }

      res.json({
        success: true,
        message: 'Code file deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting code file:', error);
      res.status(500).json({ 
        error: 'Failed to delete code file',
        details: error.message 
      });
    }
  }

  // Get all code files for a chapter
  static async getCodeFilesByChapter(req, res) {
    try {
      const { chapterId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(chapterId)) {
        return res.status(400).json({ error: 'Invalid chapter ID' });
      }

      const codeFiles = await CodeFile.find({ chapter: chapterId })
        .populate('chapter', 'title')
        .sort({ important: -1, lastModified: -1 });

      res.json({
        success: true,
        count: codeFiles.length,
        data: codeFiles
      });
    } catch (error) {
      console.error('Error fetching code files:', error);
      res.status(500).json({ 
        error: 'Failed to fetch code files',
        details: error.message 
      });
    }
  }

  // Rename code file
  static async renameCodeFile(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const codeFile = await CodeFile.findByIdAndUpdate(
        id,
        { title: title.trim(), lastModified: new Date() },
        { new: true }
      ).populate('chapter', 'title');

      if (!codeFile) {
        return res.status(404).json({ error: 'Code file not found' });
      }

      res.json({
        success: true,
        data: codeFile
      });
    } catch (error) {
      console.error('Error renaming code file:', error);
      res.status(500).json({ 
        error: 'Failed to rename code file',
        details: error.message 
      });
    }
  }

  // Toggle important status
  static async toggleImportant(req, res) {
    try {
      const { id } = req.params;

      const codeFile = await CodeFile.findById(id);
      if (!codeFile) {
        return res.status(404).json({ error: 'Code file not found' });
      }

      codeFile.important = !codeFile.important;
      await codeFile.save();

      res.json({
        success: true,
        data: { important: codeFile.important }
      });
    } catch (error) {
      console.error('Error toggling important status:', error);
      res.status(500).json({ 
        error: 'Failed to update important status',
        details: error.message 
      });
    }
  }

  // Share code file
  static async shareCodeFile(req, res) {
    try {
      const { id } = req.params;

      const codeFile = await CodeFile.findById(id);
      if (!codeFile) {
        return res.status(404).json({ error: 'Code file not found' });
      }

      if (codeFile.isShared && codeFile.shareId) {
        return res.json({
          success: true,
          shareUrl: `/share/code/${codeFile.shareId}`,
          shareId: codeFile.shareId
        });
      }

      const shareId = codeFile.generateShareId();
      await codeFile.save();

      res.json({
        success: true,
        shareUrl: `/share/code/${shareId}`,
        shareId: shareId
      });
    } catch (error) {
      console.error('Error sharing code file:', error);
      res.status(500).json({ 
        error: 'Failed to share code file',
        details: error.message 
      });
    }
  }

  // Get shared code file
  static async getSharedCodeFile(req, res) {
    try {
      const { shareId } = req.params;

      const codeFile = await CodeFile.findOne({ 
        shareId, 
        isShared: true 
      }).populate('chapter', 'title');

      if (!codeFile) {
        return res.status(404).json({ error: 'Shared code file not found' });
      }

      // Increment view count
      codeFile.viewCount += 1;
      await codeFile.save();

      res.json({
        success: true,
        data: {
          title: codeFile.title,
          content: codeFile.content,
          language: codeFile.language,
          description: codeFile.description,
          tags: codeFile.tags,
          viewCount: codeFile.viewCount,
          lastModified: codeFile.lastModified,
          chapter: codeFile.chapter?.title
        }
      });
    } catch (error) {
      console.error('Error fetching shared code file:', error);
      res.status(500).json({ 
        error: 'Failed to fetch shared code file',
        details: error.message 
      });
    }
  }

  // Revoke sharing
  static async revokeSharing(req, res) {
    try {
      const { shareId } = req.params;

      const codeFile = await CodeFile.findOne({ shareId });
      if (!codeFile) {
        return res.status(404).json({ error: 'Shared code file not found' });
      }

      codeFile.isShared = false;
      codeFile.shareId = undefined;
      await codeFile.save();

      res.json({
        success: true,
        message: 'Sharing revoked successfully'
      });
    } catch (error) {
      console.error('Error revoking share:', error);
      res.status(500).json({ 
        error: 'Failed to revoke sharing',
        details: error.message 
      });
    }
  }

  // Search code files
  static async searchCodeFiles(req, res) {
    try {
      const { query, language, chapterId } = req.query;

      let searchQuery = {};

      if (query) {
        searchQuery.$text = { $search: query };
      }

      if (language) {
        searchQuery.language = language;
      }

      if (chapterId && mongoose.Types.ObjectId.isValid(chapterId)) {
        searchQuery.chapter = chapterId;
      }

      const codeFiles = await CodeFile.find(searchQuery)
        .populate('chapter', 'title')
        .sort({ important: -1, lastModified: -1 })
        .limit(50);

      res.json({
        success: true,
        count: codeFiles.length,
        data: codeFiles
      });
    } catch (error) {
      console.error('Error searching code files:', error);
      res.status(500).json({ 
        error: 'Failed to search code files',
        details: error.message 
      });
    }
  }

  // Get user's shared code files (for dashboard)
  static async getUserSharedCodeFiles(req, res) {
    try {
      // const userId = req.user?.id; // uncomment when auth is implemented
      const userId = req.params.userId || "689738740562829489a60a41"; // temporary

      const sharedCodeFiles = await CodeFile.find({ 
        isShared: true,
        // createdBy: userId // uncomment when auth is implemented
      })
      .populate('chapter', 'title')
      .sort({ lastModified: -1 });

      const formattedData = sharedCodeFiles.map(file => ({
        shareId: file.shareId,
        title: file.title,
        language: file.language,
        type: 'code',
        viewCount: file.viewCount,
        createdAt: file.createdAt,
        lastModified: file.lastModified,
        isActive: file.isShared,
        chapter: file.chapter?.title
      }));

      res.json({
        success: true,
        data: formattedData
      });
    } catch (error) {
      console.error('Error fetching shared code files:', error);
      res.status(500).json({ 
        error: 'Failed to fetch shared code files',
        details: error.message 
      });
    }
  }
}

module.exports = CodeFileController;