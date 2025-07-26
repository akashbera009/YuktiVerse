
import mongoose from 'mongoose';
import Notebook from '../models/NoteBook.js';
import { nanoid } from 'nanoid'; // For generating note_id

export const createNotebook = async (req, res) => {
  try {
    const { name, content, note_id ,chapter } = req.body;
    
    if (!name || !chapter || !content?.textBoxes) {
      return res.status(400).json({ error: 'Missing name or content.textBoxes' });
    }

    // Validate all text boxes have IDs
    for (const box of content.textBoxes) {
      if (!box.id) {
        return res.status(400).json({ error: 'All text boxes must have IDs' });
      }
    }

    const doc = await Notebook.create({
      user: req.user._id,
      note_id: note_id || `note_${nanoid(10)}`, // Generate if not provided
      name,
      content,
      chapter 
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error('Notebook creation failed:', err);
    res.status(500).json({ error: 'Failed to create notebook' });
  }
};

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
