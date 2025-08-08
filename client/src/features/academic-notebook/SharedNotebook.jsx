import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import './SharedNotebook.css';
import axios from 'axios';
import { SquaresLoader } from '../../components/Loader';
import { FaEye, FaShare, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

const SharedNotebook = () => {
  const { shareId } = useParams();
  const [notebook, setNotebook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadSharedNotebook = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/share/notebook/${shareId}`);
        setNotebook(response.data);
      } catch (error) {
        console.error('Error loading shared notebook:', error);
        setError(error.response?.data?.message || 'Failed to load notebook');
      } finally {
        setIsLoading(false);
      }
    };

    if (shareId) {
      loadSharedNotebook();
    }
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTextBoxes = () => {
    if (!notebook?.content?.textBoxes) return null;

    return notebook.content.textBoxes.map(box => (
      <Rnd
        key={box.id}
        position={{ x: box.x, y: box.y }}
        size={{ width: box.width, height: box.height }}
        disableDragging={true}
        enableResizing={false}
        className="shared-text-box-container"
        style={{ zIndex: box.zIndex }}
      >
        <div className="shared-text-box">
          {box.text}
        </div>
      </Rnd>
    ));
  };

  if (isLoading) {
    return (
      <div className="shared-notebook-container">
        <div className="shared-loader-container">
          <SquaresLoader />
          <p>Loading shared notebook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-notebook-container">
        <div className="shared-error-container">
          <div className="error-icon">📝</div>
          <h2>Notebook Not Found</h2>
          <p>{error}</p>
          <p>This notebook may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-notebook-container">
      <div className="shared-notebook-header">
        <div className="shared-notebook-info">
          <div className="shared-icon">
            <img src=".//750003cb-fc39-41be-a28a-be393bf1013a.jpg" alt="" />
          </div>
          <div className="shared-title">
            <h1>{notebook.name}</h1>
            <p>Shared notebook - View only</p>
          </div>
        </div>
        
        <div className="shared-actions">
          <button 
            className="copy-link-btn"
            onClick={handleCopyLink}
            title="Copy share link"
          >
            {copied ? 'Copied!' : <><FaCopy /> Copy Link</>}
          </button>
        </div>
      </div>

      <div className="shared-canvas-container">
        <div className="shared-grid-lines"></div>
        <div className="shared-canvas">
          {renderTextBoxes()}
        </div>
      </div>

      <div className="shared-footer">
        <p>
          <FaShare /> This notebook was shared with you
          <span className="shared-date">
            • Shared on {new Date(notebook.sharedAt || notebook.updatedAt).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SharedNotebook;