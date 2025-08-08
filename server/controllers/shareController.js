import crypto  from 'crypto';
import Notebook  from '../models/Notebook.js'; // Your notebook model
import SharedNotebook from '../models/SharedNotebook.js'; // New model for shared notebooks


export const generateShareLink =async (req, res) => {
    try {
      const { notebookId } = req.params;
      const userId = req.user._id; // From auth middleware
console.log(notebookId , userId);

      // Check if notebook exists and belongs to user
      const notebook = await Notebook.findOne({ 
        _id: notebookId, 
        user: userId 
      });
console.log(notebook);

      if (!notebook) {
        return res.status(404).json({ 
          message: 'Notebook not found or you do not have permission' 
        });
      }

      // Check if share link already exists
      let sharedNotebook = await SharedNotebook.findOne({ 
        notebookId: notebookId 
      });

      if (sharedNotebook) {
        return res.status(200).json({
          shareId: sharedNotebook.shareId,
          shareUrl: `${process.env.CLIENT_URL}/share/notebook/${sharedNotebook.shareId}`,
          createdAt: sharedNotebook.createdAt,
          isActive: sharedNotebook.isActive
        });
      }

      // Generate unique share ID
      const shareId = crypto.randomBytes(16).toString('hex');

      // Create shared notebook record
      sharedNotebook = new SharedNotebook({
        shareId,
        notebookId,
        userId,
        isActive: true,
        createdAt: new Date()
      });

      await sharedNotebook.save();

      res.status(201).json({
        shareId,
        shareUrl: `${process.env.CLIENT_URL}/share/notebook/${shareId}`,
        createdAt: sharedNotebook.createdAt,
        isActive: true
      });

    } catch (error) {
      console.error('Error generating share link:', error);
      res.status(500).json({ message: 'Failed to generate share link' });
    }
  }

  // Get shared notebook (public route)
  export const getSharedNotebook = async (req, res) => {
    try {
      const { shareId } = req.params;
// console.log(shareId);

      // Find shared notebook
      const sharedNotebook = await SharedNotebook.findOne({ 
        shareId,
        isActive: true 
      });

      if (!sharedNotebook) {
        return res.status(404).json({ 
          message: 'Shared notebook not found or has been disabled' 
        });
      }

      // Get the actual notebook
      const notebook = await Notebook.findById(sharedNotebook.notebookId)
        .select('name content createdAt updatedAt'); // Only select needed fields

      if (!notebook) {
        return res.status(404).json({ 
          message: 'Original notebook not found' 
        });
      }

      // Update view count (optional)
      await SharedNotebook.updateOne(
        { _id: sharedNotebook._id },
        { 
          $inc: { viewCount: 1 },
          lastViewedAt: new Date()
        }
      );

      res.status(200).json({
        name: notebook.name,
        content: notebook.content,
        sharedAt: sharedNotebook.createdAt,
        updatedAt: notebook.updatedAt,
        viewCount: sharedNotebook.viewCount + 1
      });

    } catch (error) {
      console.error('Error fetching shared notebook:', error);
      res.status(500).json({ message: 'Failed to load shared notebook' });
    }
  }

  // Revoke share link
 export const  revokeShareLink = async (req, res) => {
    try {
      const { shareId } = req.params;
      const userId = req.user.id;

      const sharedNotebook = await SharedNotebook.findOne({ 
        shareId,
        userId 
      });

      if (!sharedNotebook) {
        return res.status(404).json({ 
          message: 'Share link not found or you do not have permission' 
        });
      }

      // Soft delete - mark as inactive
      sharedNotebook.isActive = false;
      sharedNotebook.revokedAt = new Date();
      await sharedNotebook.save();

      res.status(200).json({ 
        message: 'Share link revoked successfully' 
      });

    } catch (error) {
      console.error('Error revoking share link:', error);
      res.status(500).json({ message: 'Failed to revoke share link' });
    }
  }

  // Get all shared notebooks by user
export const getUserSharedNotebooks = async (req, res) => {
    try {
      const userId = req.user.id;

      const sharedNotebooks = await SharedNotebook.find({ 
        userId,
        isActive: true 
      })
      .populate('notebookId', 'name createdAt updatedAt')
      .sort({ createdAt: -1 });

      const formattedShares = sharedNotebooks.map(share => ({
        shareId: share.shareId,
        shareUrl: `${process.env.CLIENT_URL}/share/notebook/${share.shareId}`,
        notebook: share.notebookId,
        createdAt: share.createdAt,
        viewCount: share.viewCount,
        lastViewedAt: share.lastViewedAt
      }));

      res.status(200).json(formattedShares);

    } catch (error) {
      console.error('Error fetching user shared notebooks:', error);
      res.status(500).json({ message: 'Failed to fetch shared notebooks' });
    }
  }