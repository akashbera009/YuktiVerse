// models/Resume.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  filename: { 
    type: String,
    required: true 
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  analysisResult: {
    type: Object,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ filename: 1 });

export default mongoose.model('Resume', resumeSchema);