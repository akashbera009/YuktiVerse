import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Chapter', ChapterSchema);
