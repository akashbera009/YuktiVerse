import CodeFile from '../../models/codeFile/CodeFile.js';

// Create new CodeFile
export const createCodeFile = async (req, res) => {
  try {
    const { title, content, chapter,  programmingLanguage, description, tags } = req.body;

    if (!title || !chapter) {
      return res.status(400).json({ error: 'Title and chapter are required' });
    }

    const codeFile = await CodeFile.create({
      user: req.user._id,
      title,
      content,
      chapter,
       programmingLanguage,
      description,
      tags,
    });

    res.status(201).json(codeFile);
  } catch (err) {
    console.error('CodeFile creation failed:', err);
    res.status(500).json({ error: 'Failed to create code file' });
  }
};

// Get CodeFile by ID
export const getCodeFileById = async (req, res) => {
  try {
    const { _id } = req.params;
console.log(_id);

    const codeFile = await CodeFile.findOne({ _id: _id, user: req.user._id }).populate('chapter', 'title');
    console.log(codeFile);
    
    if (!codeFile) {
      return res.status(404).json({ error: 'CodeFile not found' });
    }

    res.json(codeFile);
  } catch (err) {
    console.error('Get CodeFile failed:', err);
    res.status(500).json({ error: 'Failed to get code file' });
  }
};

// Update CodeFile
export const updateCodeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const codeFile = await CodeFile.findOne({ _id: id, user: req.user._id });
    if (!codeFile) {
      return res.status(404).json({ error: 'CodeFile not found' });
    }

    Object.assign(codeFile, updates);

    const updatedCodeFile = await codeFile.save();
    res.json(updatedCodeFile);
  } catch (err) {
    console.error('Update CodeFile failed:', err);
    res.status(500).json({ error: 'Failed to update code file' });
  }
};

// Delete CodeFile
export const deleteCodeFile = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CodeFile.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ error: 'CodeFile not found' });
    }

    res.json({ message: 'CodeFile deleted successfully' });
  } catch (err) {
    console.error('Delete CodeFile failed:', err);
    res.status(500).json({ error: 'Failed to delete code file' });
  }
};

// Rename CodeFile
export const renameCodeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const updated = await CodeFile.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'CodeFile not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Rename CodeFile failed:', err);
    res.status(500).json({ error: 'Failed to rename code file' });
  }
};

// Toggle Important flag
export const toggleImportant = async (req, res) => {
  try {
    const { id } = req.params;

    const codeFile = await CodeFile.findOne({ _id: id, user: req.user._id });
    if (!codeFile) {
      return res.status(404).json({ error: 'CodeFile not found' });
    }

    codeFile.important = !codeFile.important;
    await codeFile.save();

    res.json({ important: codeFile.important });
  } catch (err) {
    console.error('Toggle important failed:', err);
    res.status(500).json({ error: 'Failed to toggle important status' });
  }
};

// Share CodeFile (generate shareId)
export const shareCodeFile = async (req, res) => {
  try {
    const { id } = req.params;

    const codeFile = await CodeFile.findOne({ _id: id, user: req.user._id });
    if (!codeFile) {
      return res.status(404).json({ error: 'CodeFile not found' });
    }

    if (codeFile.isShared && codeFile.shareId) {
      return res.json({ shareId: codeFile.shareId, shareUrl: `/share/code/${codeFile.shareId}` });
    }

    const shareId = codeFile.generateShareId();
    await codeFile.save();

    res.json({ shareId, shareUrl: `/share/code/${shareId}` });
  } catch (err) {
    console.error('Share CodeFile failed:', err);
    res.status(500).json({ error: 'Failed to share code file' });
  }
};
