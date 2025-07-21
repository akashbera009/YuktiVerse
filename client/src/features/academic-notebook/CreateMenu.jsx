import React, { useState, useRef , useEffect } from 'react';
import { FaPlus, FaFileAlt, FaFolderPlus, FaUpload, FaTimes } from 'react-icons/fa';
import './CreateMenu.css';

const CreateMenu = ({ onCreate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'note' | 'folder' | 'upload'
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef();
  const menuRef = useRef(null);
  const modalRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
   const handleClickOutsideModal = (e) => {
     if (
       modalOpen &&
       modalRef.current &&
       !modalRef.current.contains(e.target)
     ) {
    //    setModalOpen(false);
    //    setMode(null);
    //    setInputValue('');
            closeModal();
     }
   };
   document.addEventListener('mousedown', handleClickOutsideModal);
   return () => document.removeEventListener('mousedown', handleClickOutsideModal);
}, [modalOpen]);

  const openModal = (m) => {
    setMode(m);
    setMenuOpen(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setMode(null);
    setInputValue('');
     if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'upload') {
      const file = fileInputRef.current.files[0];
      if (file) onCreate('upload', file);
    } else {
      onCreate(mode, inputValue.trim());
    }
    closeModal();
  };

  return (
    <div className="create-menu"  ref={menuRef}>
      <button
        className="cm-button"
        onClick={() => setMenuOpen((o) => !o)}
        title="Create…"
      >
        <FaPlus /> Create
      </button>

      {menuOpen && (
        <div className="cm-dropdown">
          <button onClick={() => openModal('note')}>
            <FaFileAlt /> Create Note
          </button>
          <button onClick={() => openModal('folder')}>
            <FaFolderPlus /> Create Folder
          </button>
          <button onClick={() => openModal('upload')}>
            <FaUpload /> Upload File
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="cm-backdrop" >
          <div className="cm-modal" ref={modalRef}>
            <button className="cm-close" onClick={closeModal}>
              <FaTimes />
            </button>

            <form onSubmit={handleSubmit}>
              {mode === 'upload' ? (
                <>
                  <label>
                    Select file to upload
                    <input type="file" 
                        ref={fileInputRef} 
                        required 
                        onChange={(e) => {
                        if (e.target.files[0]) {
                          setInputValue(e.target.files[0].name);
                        }
                      }} />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    {mode === 'note' ? 'Note name:' : 'Folder name:'}
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Enter ${mode === 'note' ? 'note' : 'folder'} name`}
                      required
                      autoFocus
                    />
                  </label>
                </>
              )}
              <button type="submit" className="cm-submit">
                {mode === 'upload'
                  ? 'Upload'
                  : mode === 'note'
                  ? 'Create Note'
                  : 'Create Folder'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMenu;
