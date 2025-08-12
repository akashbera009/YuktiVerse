import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSave, FaShare, FaCopy, FaTimes, FaFileCode, 
  FaPlay, FaDownload, FaExpand, FaCompress, FaEdit,
  FaStar, FaUndo, FaRedo, FaStop, FaSpinner, FaTerminal
} from 'react-icons/fa';
const frontenedURL = import.meta.env.VITE_FRONTENED_URL;
const backendURL = import.meta.env.VITE_BACKEND_URL;
import './CodeEditor.css'; // Import the separated CSS file

const LANGUAGE_CONFIG = {
  javascript: { label: 'JavaScript', extension: 'js', color: '#f7df1e' },
  python: { label: 'Python', extension: 'py', color: '#3776ab' },
  html: { label: 'HTML', extension: 'html', color: '#e34f26' },
  markdown: { label: 'Markdown', extension: 'md', color: '#083fa1' },
  other: { label: 'Other', extension: 'txt', color: '#666666' }
};

const CodeEditor = ({ 
  codeFileId = null,
  initialData = null,
  onExit = () => {},
  onSave = () => {},
  onRename = () => {},
  onToggleImportant = () => {},
  onShare = () => {}
}) => {
  // State management
  const [codeFile, setCodeFile] = useState(initialData || {
    title: 'Untitled',
    content: '',
    language: 'javascript',
    description: '',
    tags: [],
    important: false,
    isShared: false,
    viewCount: 0,
    version: 1,
    collaborators: [],
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString()
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionOutput, setExecutionOutput] = useState('');
  const [executionError, setExecutionError] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  
  // Refs
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load code file data on mount if ID is provided
  useEffect(() => {
    if (codeFileId && !initialData) {
      fetchCodeFile();
    }
  }, [codeFileId]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [codeFile.content, codeFile.description, hasUnsavedChanges]);

  // Handle content changes
  useEffect(() => {
    if (initialData && (
      initialData.content !== codeFile.content || 
      initialData.description !== codeFile.description
    )) {
      setHasUnsavedChanges(true);
    }
  }, [codeFile.content, codeFile.description, initialData]);

  const fetchCodeFile = async () => {
    try {
      setIsLoading(true);
      // Simulated API call: GET /api/codefiles/:id
      const response = await fetch(`${backendURL}/api/codefiles/${codeFileId}`);
      console.log(response);
      
      const data = await response.json();
      setCodeFile(data);
    } catch (error) {
      console.error('Error fetching code file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (codeFileId) {
        // Update existing file: PUT /api/codefiles/:id
        await fetch(`${backendURL}/api/codefiles/${codeFileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: codeFile.content,
            description: codeFile.description,
            tags: codeFile.tags
          })
        });
      } else {
        // Create new file: POST ${backendURL}/api/codefiles
        const response = await fetch(`${backendURL}/api/codefiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: codeFile.title,
            content: codeFile.content,
            language: codeFile.language,
            description: codeFile.description,
            tags: codeFile.tags
          })
        });
        const newFile = await response.json();
        setCodeFile(newFile);
        onSave(newFile);
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving code file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges || !codeFileId) return;
    
    try {
      // Simulated auto-save
      await fetch(`${backendURL}/api/codefiles/${codeFileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: codeFile.content,
          description: codeFile.description
        })
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // const handleRunCode = async () => {
  //   if (!codeFile.content || isRunning) return;
    
  //   setIsRunning(true);
  //   setExecutionOutput('');
  //   setExecutionError('');
  //   setShowOutput(true);
    
  //   const startTime = Date.now();
    
  //   try {
  //     // Simulate code execution
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     setExecutionOutput("Code executed successfully");
  //   } catch (error) {
  //     setExecutionError(error.message);
  //   } finally {
  //     setExecutionTime(Date.now() - startTime);
  //     setIsRunning(false);
  //   }
  // };

  const handleRename = async () => {
    if (!codeFile.title || !codeFileId) return;
    
    try {
      // PATCH ${backendURL}/api/codefiles/:id/rename
      await fetch(`${backendURL}/api/codefiles/${codeFileId}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: codeFile.title })
      });
      setIsRenaming(false);
      onRename(codeFile.title);
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const handleToggleImportant = async () => {
    try {
      // PATCH ${backendURL}/api/codefiles/:id/important
      await fetch(`${backendURL}/api/codefiles/${codeFileId}/important`, {
        method: 'PATCH'
      });
      const updated = { ...codeFile, important: !codeFile.important };
      setCodeFile(updated);
      onToggleImportant(updated.important);
    } catch (error) {
      console.error('Error toggling important:', error);
    }
  };

  const handleShare = async () => {
    if (!codeFileId) return;
    
    try {
      setIsSharing(true);
      // POST ${backendURL}/api/codefiles/:id/share
      const response = await fetch(`${backendURL}/api/codefiles/${codeFileId}/share`, {
        method: 'POST'
      });
      const data = await response.json();
      setShareUrl(data.shareUrl);
      const updated = { ...codeFile, isShared: true };
      setCodeFile(updated);
      onShare(data.shareUrl);
    } catch (error) {
      console.error('Error sharing code file:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    const langConfig = LANGUAGE_CONFIG[codeFile.language] || LANGUAGE_CONFIG.other;
    const filename = `${codeFile.title}.${langConfig.extension}`;
    const blob = new Blob([codeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value ) {
      const newTag = e.target.value ;
      if (!codeFile.tags.includes(newTag)) {
        const updated = { ...codeFile, tags: [...codeFile.tags, newTag] };
        setCodeFile(updated);
        setHasUnsavedChanges(true);
      }
      e.target.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = { 
      ...codeFile, 
      tags: codeFile.tags.filter(tag => tag !== tagToRemove) 
    };
    setCodeFile(updated);
    setHasUnsavedChanges(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageColor = () => {
    return LANGUAGE_CONFIG[codeFile.language]?.color || '#666666';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
        Loading...
      </div>
    );
  }

  return (
    <div className={`code-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          {isRenaming ? (
            <input
              type="text"
              value={codeFile.title}
              onChange={(e) => setCodeFile({...codeFile, title: e.target.value})}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="title-input"
              autoFocus
            />
          ) : (
            <div onClick={() => setIsRenaming(true)} className="title-section">
              <FaFileCode style={{ color: getLanguageColor() }} />
              <h2 className="title-display">{codeFile.title}</h2>
              <FaEdit className="title-edit-icon" />
            </div>
          )}
          
          <div className="header-badges">
            <span 
              className="language-badge"
              style={{ backgroundColor: getLanguageColor() }}
            >
              {LANGUAGE_CONFIG[codeFile.language]?.label || codeFile.language}
            </span>
            
            {codeFile.important && (
              <FaStar className="star-icon" />
            )}
            
            {hasUnsavedChanges && (
              <span className="unsaved-indicator">•</span>
            )}
          </div>
        </div>

        <div className="header-right">
          {/* <button
            onClick={handleRunCode}
            disabled={!codeFile.content }
            className={`btn btn-run ${isRunning ? 'running' : ''}`}
          >
            {isRunning ? <FaStop /> : <FaPlay />}
            Run
          </button> */}
          
          <button
            onClick={handleToggleImportant}
            className={`btn btn-important ${codeFile.important ? 'active' : ''}`}
            title="Toggle Important"
          >
            <FaStar />
          </button>
          
          <button
            onClick={handleDownload}
            className="btn btn-download"
            title="Download File"
          >
            <FaDownload />
          </button>
          
          <button
            onClick={handleShare}
            disabled={isSharing || codeFile.isShared}
            className={`btn btn-share ${codeFile.isShared ? 'shared' : ''}`}
          >
            <FaShare />
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="btn btn-save"
          >
            <FaSave />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          
          <button 
            onClick={onExit} 
            className="btn btn-exit"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Language & Tags */}
      <div className="language-tags-section">
        <div className="language-selector">
          <label>Language:</label>
          <select
            value={codeFile.language}
            onChange={(e) => {
              setCodeFile({...codeFile, language: e.target.value});
              setHasUnsavedChanges(true);
            }}
            className="language-select"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="tags-section">
          <label>Tags:</label>
          <div className="tags-section">
            {codeFile.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="tag-remove"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="tag-input"
            />
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="editor-container">
        {/* Code Editor */}
        <div className="code-section">
          <div className="section-header">
            <span>Code</span>
            <div className="code-stats">
              Lines: {codeFile.content.split('\n').length} | 
              Size: {new Blob([codeFile.content]).size} bytes
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={codeFile.content}
            onChange={(e) => {
              setCodeFile({...codeFile, content: e.target.value});
              setHasUnsavedChanges(true);
            }}
            className="code-textarea"
            placeholder="Start coding here..."
          />
        </div>

        {/* Output Panel */}
        {showOutput && (
          <div className="output-panel">
            <div className="output-header">
              <div className="output-header-left">
                <FaTerminal />
                <span>Output</span>
              </div>
              <button
                onClick={() => setShowOutput(false)}
                className="output-close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="output-content">
              {isRunning ? (
                <div className="output-running">
                  <FaSpinner className="loading-spinner" />
                  Running code...
                </div>
              ) : executionOutput ? (
                <pre>{executionOutput}</pre>
              ) : (
                <div className="output-idle">
                  Click Run to execute your code
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="description-section">
        <div className="section-header">
          <span>Description</span>
        </div>
        <textarea
          value={codeFile.description}
          onChange={(e) => {
            setCodeFile({...codeFile, description: e.target.value});
            setHasUnsavedChanges(true);
          }}
          className="description-textarea"
          placeholder="Describe your code..."
        />
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-left">
          <span>Last modified: {formatDate(codeFile.lastModified)}</span>
          {codeFile.isShared && (
            <span>Views: {codeFile.viewCount}</span>
          )}
        </div>
        <div className="footer-right">
          {isSaving && <span className="saving-indicator">Saving...</span>}
          {hasUnsavedChanges && !isSaving && (
            <span className="unsaved-changes">Unsaved changes</span>
          )}
          <span>Version: {codeFile.version}</span>
        </div>
      </div>

      {/* Share Modal */}
      {shareUrl && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Share Code File</h3>
            <div className="share-url-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-url-input"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="btn btn-copy"
              >
                <FaCopy /> Copy
              </button>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShareUrl('')}
                className="btn btn-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;