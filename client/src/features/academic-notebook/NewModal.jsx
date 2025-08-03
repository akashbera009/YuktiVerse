// NewModal.jsx
import React, { useState } from 'react';
import { FaFilePdf, FaImage, FaStickyNote, FaTimes } from 'react-icons/fa';
import './NewModal.css'

export default function NewModal({ onClose, onUploadFile, onCreateNotebook }) {
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
              style={{display: 'none'}}
              onChange={e => onUploadFile(e.target.files[0], 'pdf')}
            />
          </label>
          <label className="upload-btn">
            <FaImage/> Upload Image
            <input
              type="file"
              accept="image/*"
              style={{display: 'none'}}
              onChange={e => onUploadFile(e.target.files[0], 'image')}
            />
          </label>
          <button onClick={onCreateNotebook}>
            <FaStickyNote/> New Notebook
          </button>
        </div>
      </div>
    </div>
  );
}
