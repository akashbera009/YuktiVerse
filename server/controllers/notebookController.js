
// import mongoose from 'mongoose';
import Notebook from '../models/NoteBook.js';
import { nanoid } from 'nanoid'; // For generating note_id

export const createNotebook = async (req, res) => {
  try {
    const { name, content, chapter } = req.body;

    if (!name || !chapter || !content?.textBoxes) {
      return res.status(400).json({ error: 'Missing name, chapter, or content.textBoxes' });
    }

    for (const box of content.textBoxes) {
      if (!box.id) {
        return res.status(400).json({ error: 'All text boxes must have IDs' });
      }
    }

    const notebook = await Notebook.create({
      user: req.user._id,
      note_id: `note_${nanoid(10)}`, // always auto-generated
      name,
      content,
      chapter,
    });

    res.status(201).json(notebook);
  } catch (err) {
    console.error('Notebook creation failed:', err);
    res.status(500).json({ error: 'Failed to create notebook' });
  }
}

// Updated getNotebookById to use note_id
export const getNotebookById = async (req, res) => {
  try {
    const notebook = await Notebook.findOne({
      note_id: req.params.id,
      user: req.user._id
    });
    
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }
    
    res.json(notebook);
  } catch (err) {
    console.error('Get notebook failed:', err);
    res.status(500).json({ error: 'Failed to get notebook' });
  }
};

// Updated updateNotebook to use note_id
export const updateNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const notebook = await Notebook.findOne({
      note_id: id,
      user: req.user._id
    });
    
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }

    // Validate textBoxes have IDs
    if (content?.textBoxes) {
      for (const box of content.textBoxes) {
        if (!box.id) {
          return res.status(400).json({ error: 'All text boxes must have IDs' });
        }
      }
    }

    notebook.name = name || notebook.name;
    notebook.content = content || notebook.content;

    const updatedNotebook = await notebook.save();
    res.json(updatedNotebook);
  } catch (err) {
    console.error('Update notebook failed:', err);
    res.status(500).json({ error: 'Failed to update notebook' });
  }
};

export const renameNotebook = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { name } = req.body;

    const updated = await Notebook.findByIdAndUpdate(noteId, { name }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename notebook' });
  }
};

export const toggleImportantNotebook = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Notebook.findById(noteId);
    note.important = !note.important;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle important status' });
  }
};
// controllers/notebookController.js
export const deleteNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    await Notebook.findByIdAndDelete(id);
    res.status(200).json({ message: "Notebook deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notebook" });
  }
};
