// models/HandwrittenNote.js
import mongoose from 'mongoose';

const HandwrittenNoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  year: {
    type: String,
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    default: 'Untitled Note',
  },
  fileType: {
    type: String,
    enum: ['image', 'pdf'],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Automatically update `updatedAt`
HandwrittenNoteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('HandwrittenNote', HandwrittenNoteSchema);
