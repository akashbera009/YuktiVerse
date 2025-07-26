// controllers/handwrittenNoteController.js


import HandwrittenNote from '../models/HandwrittenNote.js';
import path from 'path';
import { uploadOnCloudinary } from '../middlewares/Cloudinary.js';

// Upload a handwritten note
export const uploadNote = async (req, res) => {
  try {
    const { chapter, title } = req.body;
    if (!req.file) return res.status(400).json({ error: 'File is required' });

 // Local disk path from multer
    const localPath = req.file.path;

    // 1) Upload to Cloudinary
    const uploadResult = await uploadOnCloudinary(localPath);
    if (!uploadResult) {
      return res.status(500).json({ error: 'Cloudinary upload failed' });
    }

    // 2) Prepare note fields
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    const fileUrl  = uploadResult.secure_url;

    const note = await HandwrittenNote.create({
      user: req.user._id,
      chapter,
      title,
      fileType,
      fileUrl
    });
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload note' });
  }
};

// emnio ei fuunction ta lagbe bole mone hoina , kaorn eta pore ekabre chapter diye list kore ana hobe notebook ermotoi 
export const getHandWrittenNotes = async (req, res) => {
  try {
    const { chapter } = req.query;

    if (!chapter) {
      return res.status(400).json({ error: 'Chapter ID is required' });
    }

    const notes = await HandwrittenNote.find({
      user: req.user._id,
      chapter,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error('Error fetching handwritten notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};
