import SharedCodeFile from '../../models/codefile/SharedCodeFile.js';
// import CodeFile from '../../models/codefile/CodeFile.js';
import crypto from 'crypto';

// Generate a unique share link for a code file
export const generateCodeFileShareLink = async (req, res) => {
  try {
    const { codeFileId } = req.params;
    const userId = req.user._id; // assuming auth middleware adds user to req

    // Find the code file to share
    const codeFile = await CodeFile.findById(codeFileId);
    if (!codeFile) {
      return res.status(404).json({ message: 'Code file not found.' });
    }

    // Confirm ownership or permission (optional)
    if (codeFile.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to share this code file.' });
    }

    // Check if already shared (active)
    let sharedEntry = await SharedCodeFile.findOne({ codeFileId, userId, isActive: true });

    if (!sharedEntry) {
      // Create new share entry
      const shareId = crypto.randomBytes(16).toString('hex');
      sharedEntry = new SharedCodeFile({
        shareId,
        codeFileId,
        userId,
        type: codeFile.language || 'other',
        title: codeFile.title,
        isActive: true,
        viewCount: 0
      });

      await sharedEntry.save();
    }

    return res.status(200).json({
      message: 'Share link generated successfully',
      shareId: sharedEntry.shareId,
      shareUrl: sharedEntry.shareUrl
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a shared code file by shareId (public)
export const getSharedCodeFile = async (req, res) => {
  try {
    const { shareId } = req.params;

    // Find shared entry and check if active
    const sharedEntry = await SharedCodeFile.findOne({ shareId, isActive: true }).populate('codeFileId');
    if (!sharedEntry) {
      return res.status(404).json({ message: 'Shared code file not found or link is inactive.' });
    }

    // Increment view count and update lastViewedAt
    sharedEntry.viewCount += 1;
    sharedEntry.lastViewedAt = new Date();
    await sharedEntry.save();

    // Return the code file content and metadata
    return res.status(200).json({
      title: sharedEntry.title,
      language: sharedEntry.type,
      content: sharedEntry.codeFileId.content,
      viewCount: sharedEntry.viewCount,
      lastViewedAt: sharedEntry.lastViewedAt
    });
  } catch (error) {
    console.error('Error fetching shared code file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Revoke sharing by shareId (protected, owner only)
export const revokeCodeFileShareLink = async (req, res) => {
  try {
    const { userId, shareId } = req.params;
    const authUserId = req.user._id.toString();

    if (userId !== authUserId) {
      return res.status(403).json({ message: 'Unauthorized to revoke this share link.' });
    }

    const sharedEntry = await SharedCodeFile.findOne({ shareId, userId, isActive: true });
    if (!sharedEntry) {
      return res.status(404).json({ message: 'Active share link not found.' });
    }

    sharedEntry.isActive = false;
    sharedEntry.revokedAt = new Date();
    await sharedEntry.save();

    return res.status(200).json({ message: 'Share link revoked successfully.' });
  } catch (error) {
    console.error('Error revoking share link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all active shared code files by user (protected)
export const getUserSharedCodeFiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const authUserId = req.user._id.toString();

    if (userId !== authUserId) {
      return res.status(403).json({ message: 'Unauthorized to access shared files.' });
    }

    const sharedFiles = await SharedCodeFile.find({ userId, isActive: true }).populate('codeFileId');

    return res.status(200).json({ sharedFiles });
  } catch (error) {
    console.error('Error fetching user shared code files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
