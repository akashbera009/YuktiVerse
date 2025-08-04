// NewModal.jsx
import React, { useState } from 'react';
import { FaFilePdf, FaImage, FaStickyNote, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './NewModal.css';

export default function NewModal({
  onClose,
  onUploadFile,
  onCreateNotebook,   // now matches parent
  selectedChapterId
}) {
  const [showNotebookForm, setShowNotebookForm] = useState(false);
  const [notebookName, setNotebookName]         = useState('');
  const [textBoxes, setTextBoxes]               = useState([]);
  const [isSaving, setIsSaving]                 = useState(false);

  const createNotebook = async () => {
    if (!notebookName.trim()) {
      alert('Please enter a notebook name.');
      return;
    }
    if (!selectedChapterId) {
      alert('Please select a chapter first.');
      return;
    }

    const payload = {
      name: notebookName.trim(),
      chapter: selectedChapterId,
      content: { textBoxes }
    };
    console.log('📤 payload:', payload);

    setIsSaving(true);
    try {
      const { data: newNotebook } = await axios.post('/api/notebooks/', payload);
      onCreateNotebook(newNotebook);
      // Reset form state
      setNotebookName('');
      setTextBoxes([]);
      setShowNotebookForm(false);
    } catch (err) {
      console.error('Failed to create notebook:', err.response?.data || err.message);
      alert('Could not create notebook: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FaTimes/></button>
        <h3>Create or Upload</h3>
        <div className="modal-actions">
          <label className="upload-btn">
            <FaFilePdf/> Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={e => onUploadFile(e.target.files[0], 'pdf')}
            />
          </label>
          <label className="upload-btn">
            <FaImage/> Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => onUploadFile(e.target.files[0], 'image')}
            />
          </label>
          <button
            className="notebook-btn"
            onClick={() => setShowNotebookForm(true)}
          >
            <FaStickyNote/> New Notebook
          </button>
        </div>
      </div>

      {showNotebookForm && (
        <div className="modal-overlay" onClick={() => setShowNotebookForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowNotebookForm(false)}>
              <FaTimes/>
            </button>
            <h3>Create New Notebook</h3>
            <input
              type="text"
              placeholder="Notebook name"
              value={notebookName}
              onChange={e => setNotebookName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => setShowNotebookForm(false)}>Cancel</button>
              <button
                onClick={createNotebook}
                disabled={!notebookName.trim() || isSaving}
              >
                {isSaving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
