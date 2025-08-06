// NewModal.jsx
import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaImage, FaStickyNote, FaTimes, FaPlus, FaUpload, 
  
  // FaSparkles

} from 'react-icons/fa';
import axios from 'axios';
import './NewModal.css';

export default function NewModal({
  onClose,
  onUploadFile,
  onCreateNotebook,
  selectedChapterId
}) {
  const [showNotebookForm, setShowNotebookForm] = useState(false);
  const [notebookName, setNotebookName] = useState('');
  const [textBoxes, setTextBoxes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

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

    setIsSaving(true);
    try {
      const { data: newNotebook } = await axios.post('/api/notebooks/', payload);
      onCreateNotebook(newNotebook);
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

  const handleFileUpload = (file, type) => {
    onUploadFile(file, type);
    handleClose();
  };

  return (
    <div 
      className={`modal-backdrop ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose}
    >
      <div className={`modal ${isVisible ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="close-btn-mod" onClick={handleClose}>
          <FaTimes />
        </button>
        
        <div className="modal-header"></div>
        {/* <div className="modal-header">
          <div className="modal-icon">
            <FaPlus />
          </div>
          <h3>Create New Content</h3>
          <p>Choose what you'd like to create or upload</p>
        </div> */}

        <div className="modal-actions">
       {/* <button className="spacer-button" aria-hidden="true"></button> */}


          {/* <label className="action-card upload-card image"> */}
          <button className="action-card upload-card pdf">
            <div className="card-icon">
                 <FaFilePdf />
            </div>
           <div className="card-content">
              <h4>Upload PDF</h4>
              <p>Import PDF documents</p>
            </div>
            <div className="card-arrow">→</div>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => handleFileUpload(e.target.files[0], 'image')}
              />
          </button>
          <button className="action-card upload-card image">
            <div className="card-icon">
              <FaImage />
            </div>
            <div className="card-content">
              <h4>Upload Image</h4>
              <p>Add images to your collection</p>
            </div>
            <div className="card-arrow">→</div>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => handleFileUpload(e.target.files[0], 'image')}
              />
          </button>
          {/* </label> */}

          <button
            className="action-card notebook-card"
            onClick={() => setShowNotebookForm(true)}
          >
            <div className="card-icon">
              <FaStickyNote />
            </div>
            <div className="card-content">
              <h4>New Notebook</h4>
              <p>Create a blank notebook</p>
            </div>
            <div className="card-arrow">→</div>
          </button>
        </div>
      </div>

      {/* Notebook Form Modal */}
      {showNotebookForm && (
        <div 
          className={`modal-overlay notebook-form-overlay ${showNotebookForm ? 'visible' : ''}`} 
          onClick={() => setShowNotebookForm(false)}
        >
          <div className="modal-content notebook-form" onClick={e => e.stopPropagation()}>
            <button className="close-btn-mod" onClick={() => setShowNotebookForm(false)}>
              <FaTimes />
            </button>
            
            {/* <div className="form-header">
              <div className="form-icon">
                sparkle
              </div>
              <h3>Create New Notebook</h3>
              <p>Give your notebook a memorable name</p>
            </div> */}

            <div className="form-content">
              <div className="input-group">
                <label>Notebook Name</label>
                <input
                  type="text"
                  placeholder="Enter notebook name..."
                  value={notebookName}
                  onChange={e => setNotebookName(e.target.value)}
                  autoFocus
                  className="modern-input"
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowNotebookForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={createNotebook}
                  disabled={!notebookName.trim() || isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="spinner"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Notebook 
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}