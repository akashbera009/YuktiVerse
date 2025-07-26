// server /notebooks  

import mongoose from 'mongoose';

const ResumeAnalyzerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  response_content: {
    type: String,
    required: true,
  },
  resume_url:{
    type: String , 
    required: true
  }
}, { timestamps: true });

export default mongoose.models.ResumeAnalyzer || mongoose.model('ResumeAnalyzer', ResumeAnalyzerSchema);
