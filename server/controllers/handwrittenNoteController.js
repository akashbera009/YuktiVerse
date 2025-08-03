// controllers/handwrittenNoteController.js


import HandwrittenNote from '../models/HandwrittenNote.js';
import path from 'path';
import { uploadOnCloudinary } from '../middlewares/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

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
    const public_id  = uploadResult.public_id;
    const important = false ; 
    const note = await HandwrittenNote.create({
      user: req.user._id,
      chapter,
      title,
      fileType,
      fileUrl,
      important, 
      public_id  
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


export const renameNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title } = req.body;

    const updated = await HandwrittenNote.findByIdAndUpdate(noteId, { title }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename handwritten note' });
  }
};

export const toggleImportantNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await HandwrittenNote.findById(noteId);
    note.important = !note.important;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle important status' });
  }
};

// controllers/handwrittenController.js
export const deleteHandwrittenNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await HandwrittenNote.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // 1. Delete file from Cloudinary
    if (note.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(note.cloudinaryPublicId);
    }

    // 2. Delete from DB
    await note.deleteOne();

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting handwritten note:", err);
    res.status(500).json({ error: "Failed to delete handwritten note" });
  }
};