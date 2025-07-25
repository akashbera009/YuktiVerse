// server /notebooks  

import mongoose from 'mongoose';

const TextBoxSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
}, { _id: false });

const NotebookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true  // if every note must be tied to a chapter
  },
  note_id: {  // New field for frontend reference
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    textBoxes: [TextBoxSchema],
  },
}, { timestamps: true });

// const Notebook = mongoose.model('Notebook', NotebookSchema);
// export default Notebook;
export default mongoose.models.Notebook || mongoose.model('Notebook', NotebookSchema);
