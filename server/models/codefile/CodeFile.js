// // models/CodeFile.js
// const mongoose = require('mongoose');

// const codeFileSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   content: {
//     type: String,
//     default: ''
//   },
//   language: {
//     type: String,
//     required: true,
//     enum: [
//       'javascript', 'python', 'java', 'cpp', 'c', 'html', 'css', 
//       'typescript', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
//       'sql', 'json', 'xml', 'yaml', 'markdown', 'bash', 'powershell',
//       'r', 'scala', 'perl', 'dart', 'lua', 'matlab', 'other'
//     ],
//     default: 'javascript'
//   },
//   description: {
//     type: String,
//     default: ''
//   },
//   chapter: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Chapter',
//     required: true
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }],
//   important: {
//     type: Boolean,
//     default: false
//   },
//   isShared: {
//     type: Boolean,
//     default: false
//   },
//   shareId: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   viewCount: {
//     type: Number,
//     default: 0
//   },
//   lastModified: {
//     type: Date,
//     default: Date.now
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     // required: true // uncomment when user auth is implemented
//   }
// }, {
//   timestamps: true
// });

// // Update lastModified on save
// codeFileSchema.pre('save', function(next) {
//   this.lastModified = new Date();
//   next();
// });

// // Generate unique share ID when sharing
// codeFileSchema.methods.generateShareId = function() {
//   const crypto = require('crypto');
//   this.shareId = crypto.randomBytes(16).toString('hex');
//   this.isShared = true;
//   return this.shareId;
// };

// // Virtual for file size estimation
// codeFileSchema.virtual('estimatedSize').get(function() {
//   return this.content ? Buffer.byteLength(this.content, 'utf8') : 0;
// });

// // Index for better search performance
// codeFileSchema.index({ title: 'text', content: 'text', tags: 'text' });
// codeFileSchema.index({ chapter: 1 });
// codeFileSchema.index({ shareId: 1 });
// codeFileSchema.index({ important: 1 });

// const CodeFile = mongoose.model('CodeFile', codeFileSchema);

// module.exports = CodeFile;


// models/CodeFile.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema, model } = mongoose;

const codeFileSchema = new Schema({
  user: {                      // renamed createdBy to user for consistency
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chapter: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  programmingLanguage: {
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
  version: {
    type: Number,
    default: 1
  },
  size: {
    type: Number
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Middleware: update lastModified and increment version on content change
codeFileSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.version += 1;
    this.size = Buffer.byteLength(this.content, 'utf8');
  }
  this.lastModified = new Date();
  next();
});

// Method to generate unique shareId
codeFileSchema.methods.generateShareId = function() {
  this.shareId = crypto.randomBytes(16).toString('hex');
  this.isShared = true;
  return this.shareId;
};

// Virtual for estimated size
codeFileSchema.virtual('estimatedSize').get(function() {
  return this.content ? Buffer.byteLength(this.content, 'utf8') : 0;
});

// Indexes
codeFileSchema.index({ title: 'text', content: 'text', tags: 'text' });
codeFileSchema.index({ chapter: 1 });
codeFileSchema.index({ shareId: 1 });
codeFileSchema.index({ important: 1 });

const CodeFile = model('CodeFile', codeFileSchema);

export default CodeFile;
