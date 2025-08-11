// models/CodeFile.js
const mongoose = require('mongoose');

const codeFileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    required: true,
    enum: [
      'javascript', 'python', 'java', 'cpp', 'c', 'html', 'css', 
      'typescript', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'sql', 'json', 'xml', 'yaml', 'markdown', 'bash', 'powershell',
      'r', 'scala', 'perl', 'dart', 'lua', 'matlab', 'other'
    ],
    default: 'javascript'
  },
  description: {
    type: String,
    default: ''
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  important: {
    type: Boolean,
    default: false
  },
  isShared: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true // uncomment when user auth is implemented
  }
}, {
  timestamps: true
});

// Update lastModified on save
codeFileSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Generate unique share ID when sharing
codeFileSchema.methods.generateShareId = function() {
  const crypto = require('crypto');
  this.shareId = crypto.randomBytes(16).toString('hex');
  this.isShared = true;
  return this.shareId;
};

// Virtual for file size estimation
codeFileSchema.virtual('estimatedSize').get(function() {
  return this.content ? Buffer.byteLength(this.content, 'utf8') : 0;
});

// Index for better search performance
codeFileSchema.index({ title: 'text', content: 'text', tags: 'text' });
codeFileSchema.index({ chapter: 1 });
codeFileSchema.index({ shareId: 1 });
codeFileSchema.index({ important: 1 });

const CodeFile = mongoose.model('CodeFile', codeFileSchema);

module.exports = CodeFile;