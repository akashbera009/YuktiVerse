import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSave, FaShare, FaCopy, FaTimes, FaCode, FaFileCode, 
  FaPlay, FaDownload, FaExpand, FaCompress, FaEdit,
  FaStar, FaTrash, FaEye, FaClock, FaTags, FaUndo, FaRedo
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

// Language configuration for syntax highlighting and file extensions
const LANGUAGE_CONFIG = {
  javascript: { label: 'JavaScript', extension: 'js', color: '#f7df1e' },
  python: { label: 'Python', extension: 'py', color: '#3776ab' },
  java: { label: 'Java', extension: 'java', color: '#ed8b00' },
  cpp: { label: 'C++', extension: 'cpp', color: '#00599c' },
  c: { label: 'C', extension: 'c', color: '#a8b9cc' },
  html: { label: 'HTML', extension: 'html', color: '#e34f26' },
  css: { label: 'CSS', extension: 'css', color: '#1572b6' },
  typescript: { label: 'TypeScript', extension: 'ts', color: '#3178c6' },
  php: { label: 'PHP', extension: 'php', color: '#777bb4' },
  ruby: { label: 'Ruby', extension: 'rb', color: '#cc342d' },
  go: { label: 'Go', extension: 'go', color: '#00add8' },
  rust: { label: 'Rust', extension: 'rs', color: '#000000' },
  swift: { label: 'Swift', extension: 'swift', color: '#fa7343' },
  kotlin: { label: 'Kotlin', extension: 'kt', color: '#7f52ff' },
  sql: { label: 'SQL', extension: 'sql', color: '#336791' },
  json: { label: 'JSON', extension: 'json', color: '#000000' },
  xml: { label: 'XML', extension: 'xml', color: '#0060ac' },
  yaml: { label: 'YAML', extension: 'yaml', color: '#cb171e' },
  markdown: { label: 'Markdown', extension: 'md', color: '#083fa1' },
  bash: { label: 'Bash', extension: 'sh', color: '#4eaa25' },
  powershell: { label: 'PowerShell', extension: 'ps1', color: '#012456' },
  r: { label: 'R', extension: 'r', color: '#276dc3' },
  scala: { label: 'Scala', extension: 'scala', color: '#dc322f' },
  perl: { label: 'Perl', extension: 'pl', color: '#39457e' },
  dart: { label: 'Dart', extension: 'dart', color: '#0175c2' },
  lua: { label: 'Lua', extension: 'lua', color: '#000080' },
  matlab: { label: 'MATLAB', extension: 'm', color: '#e16737' },
  other: { label: 'Other', extension: 'txt', color: '#666666' }
};

const CodeEditor = ({ 
  codeFileId, 
  initialData = null, 
  onExit, 
  onRename, 
  onToggleImportant, 
  onDelete,
  onShareLinkGenerated 
}) => {
  const [codeFile, setCodeFile] = useState(initialData);
  const [content, setContent] = useState(initialData?.content || '');
  const [title, setTitle] = useState(initialData?.title || 'Untitled');
  const [language, setLanguage] = useState(initialData?.language || 'javascript');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(0);
  
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  
  // Load code file data on mount
  useEffect(() => {
    if (codeFileId && !initialData) {
      fetchCodeFile();
    }
  }, [codeFileId]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && codeFile) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, description, hasUnsavedChanges]);

  // Handle content changes
  useEffect(() => {
    if (initialData?.content !== content || initialData?.description !== description) {
      setHasUnsavedChanges(true);
    }
  }, [content, description, initialData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            e.preventDefault();
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              // Handle run code functionality here if needed
            }
            break;
        }
      }
      
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, undoStack, redoStack]);

  const fetchCodeFile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendURL}/api/code-files/${codeFileId}`);
      const data = response.data.data;
      
      setCodeFile(data);
      setContent(data.content || '');
      setTitle(data.title || 'Untitled');
      setLanguage(data.language || 'javascript');
      setDescription(data.description || '');
      setTags(data.tags || []);
      
      // Initialize undo stack
      setUndoStack([{ content: data.content, description: data.description }]);
    } catch (error) {
      console.error('Error fetching code file:', error);
      toast.error('Failed to load code file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!codeFile || isSaving) return;
    
    try {
      setIsSaving(true);
      
      const updateData = {
        content,
        description,
        tags: tags.filter(tag => tag.trim() !== '')
      };
      
      await axios.put(`${backendURL}/api/code-files/${codeFile._id}`, updateData);
      
      setHasUnsavedChanges(false);
      toast.success('Code saved successfully');
      
      // Update local state
      setCodeFile(prev => ({ ...prev, ...updateData, lastModified: new Date() }));
      
    } catch (error) {
      console.error('Error saving code file:', error);
      toast.error('Failed to save code file');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges || !codeFile) return;
    
    try {
      const updateData = { content, description };
      await axios.put(`${backendURL}/api/code-files/${codeFile._id}`, updateData);
      setHasUnsavedChanges(false);
      
      // Subtle indication of auto-save
      toast.info('Auto-saved', { 
        position: 'bottom-right',
        autoClose: 1000,
        hideProgressBar: true 
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleRename = async () => {
    if (!title.trim() || !codeFile) return;
    
    try {
      await axios.patch(`${backendURL}/api/code-files/${codeFile._id}/rename`, { title: title.trim() });
      setCodeFile(prev => ({ ...prev, title: title.trim() }));
      onRename?.(codeFile, 'code', title.trim());
      setIsRenaming(false);
      toast.success('File renamed successfully');
    } catch (error) {
      console.error('Error renaming file:', error);
      toast.error('Failed to rename file');
    }
  };

  const handleShare = async () => {
    if (!codeFile) return;
    
    try {
      setIsSharing(true);
      const response = await axios.post(`${backendURL}/api/code-files/${codeFile._id}/share`);
      const fullUrl = `${window.location.origin}${response.data.shareUrl}`;
      
      setShareUrl(fullUrl);
      onShareLinkGenerated?.();
      toast.success('Share link generated');
    } catch (error) {
      console.error('Error sharing code file:', error);
      toast.error('Failed to generate share link');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = () => {
    const langConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.other;
    const filename = `${title}.${langConfig.extension}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const currentState = { content, description };
      const previousState = undoStack[undoStack.length - 2];
      
      setRedoStack(prev => [...prev, currentState]);
      setUndoStack(prev => prev.slice(0, -1));
      
      setContent(previousState.content);
      setDescription(previousState.description);
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      
      setUndoStack(prev => [...prev, { content, description }]);
      setRedoStack(prev => prev.slice(0, -1));
      
      setContent(nextState.content);
      setDescription(nextState.description);
      setHasUnsavedChanges(true);
    }
  };

  const addToUndoStack = () => {
    setUndoStack(prev => [...prev, { content, description }]);
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    
    // Add to undo stack periodically
    if (content.length > 0 && Math.abs(newContent.length - content.length) > 10) {
      addToUndoStack();
    }
    
    setContent(newContent);
  };

  const getLanguageColor = () => {
    return LANGUAGE_CONFIG[language]?.color || '#666666';
  };

  const getEstimatedFileSize = () => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`code-editor-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="code-editor-header">
        <div className="header-left">
          <div className="file-info">
            {isRenaming ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsRenaming(false);
                }}
                className="rename-input"
                autoFocus
              />
            ) : (
              <div className="file-title" onClick={() => setIsRenaming(true)}>
                <FaFileCode style={{ color: getLanguageColor() }} />
                {title}
                <FaEdit className="edit-icon" />
              </div>
            )}
            <div className="file-meta">
              <span className="language-badge" style={{ backgroundColor: getLanguageColor() }}>
                {LANGUAGE_CONFIG[language]?.label || language}
              </span>
              <span className="file-size">{getEstimatedFileSize()}</span>
              {hasUnsavedChanges && <span className="unsaved-indicator">•</span>}
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            className="action-btn"
            title="Undo (Ctrl+Z)"
          >
            <FaUndo />
          </button>
          
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="action-btn"
            title="Redo (Ctrl+Shift+Z)"
          >
            <FaRedo />
          </button>

          <button
            onClick={() => onToggleImportant?.(codeFile, 'code')}
            className={`action-btn ${codeFile?.important ? 'active' : ''}`}
            title="Toggle Important"
          >
            <FaStar />
          </button>

          <button
            onClick={handleDownload}
            className="action-btn"
            title="Download File"
          >
            <FaDownload />
          </button>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="action-btn"
            title="Share File"
          >
            <FaShare />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="action-btn"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="action-btn save-btn"
            title="Save (Ctrl+S)"
          >
            <FaSave />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button onClick={onExit} className="action-btn close-btn">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Language Selector & Tags */}
      <div className="code-editor-meta">
        <div className="meta-section">
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setHasUnsavedChanges(true);
            }}
            className="language-selector"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="meta-section tags-section">
          <label>Tags:</label>
          <div className="tags-container">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
            <div className="add-tag">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                }}
                placeholder="Add tag..."
                className="tag-input"
              />
              <button onClick={handleAddTag} className="add-tag-btn">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="code-editor-body">
        <div className="editor-section">
          <div className="editor-header">
            <FaCode />
            <span>Code</span>
            <div className="editor-stats">
              Lines: {content.split('\n').length} | 
              Characters: {content.length}
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            className="code-textarea"
            placeholder="Start coding here..."
            spellCheck={false}
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              tabSize: 2
            }}
          />
        </div>

        <div className="description-section">
          <div className="description-header">
            <FaEdit />
            <span>Description</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description-textarea"
            placeholder="Add a description for this code file..."
            rows={4}
          />
        </div>
      </div>

      {/* Share Modal */}
      {shareUrl && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h3>Share Code File</h3>
            <p>Anyone with this link can view your code file:</p>
            <div className="share-link-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-link-input"
              />
              <button onClick={handleCopyShareLink} className="copy-btn">
                <FaCopy />
              </button>
            </div>
            <div className="share-modal-actions">
              <button onClick={() => setShareUrl('')} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="code-editor-footer">
        <div className="footer-left">
          <span>Last modified: {codeFile?.lastModified ? new Date(codeFile.lastModified).toLocaleString() : 'Never'}</span>
        </div>
        <div className="footer-right">
          {isSaving && <span className="saving-indicator">Saving...</span>}
          {hasUnsavedChanges && !isSaving && <span className="unsaved-indicator">Unsaved changes</span>}
        </div>
      </div>

      <style jsx>{`
        .code-editor-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1e1e1e;
          color: #d4d4d4;
        }

        .code-editor-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        .code-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #252526;
          border-bottom: 1px solid #3e3e42;
        }

        .header-left .file-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .file-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .file-title:hover {
          background: #2d2d30;
        }

        .edit-icon {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .file-title:hover .edit-icon {
          opacity: 1;
        }

        .rename-input {
          background: #3c3c3c;
          border: 1px solid #007acc;
          color: #d4d4d4;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
        }

        .file-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #cccccc;
        }

        .language-badge {
          padding: 2px 8px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
        }

        .unsaved-indicator {
          color: #f48771;
          font-size: 20px;
          line-height: 1;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #0e639c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #1177bb;
        }

        .action-btn:disabled {
          background: #464647;
          color: #888;
          cursor: not-allowed;
        }

        .action-btn.active {
          background: #f9c23c;
          color: #1e1e1e;
        }

        .save-btn {
          background: #16825d;
        }

        .save-btn:hover {
          background: #1a9660;
        }

        .close-btn {
          background: #d73a49;
        }

        .close-btn:hover {
          background: #e85265;
        }

        .code-editor-meta {
          display: flex;
          gap: 24px;
          padding: 12px 20px;
          background: #2d2d30;
          border-bottom: 1px solid #3e3e42;
        }

        .meta-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meta-section label {
          font-size: 12px;
          color: #cccccc;
          font-weight: 500;
        }

        .language-selector {
          background: #3c3c3c;
          color: #d4d4d4;
          border: 1px solid #464647;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .tags-section {
          flex: 1;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #0e639c;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
        }

        .tag button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .tag button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .add-tag {
          display: flex;
          gap: 4px;
        }

        .tag-input {
          background: #3c3c3c;
          border: 1px solid #464647;
          color: #d4d4d4;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          width: 100px;
        }

        .add-tag-btn {
          background: #16825d;
          color: white;
          border: none;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .code-editor-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .editor-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #3e3e42;
        }

        .editor-header, .description-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #383838;
          color: #cccccc;
          font-size: 12px;
          font-weight: 500;
        }

        .editor-stats {
          margin-left: auto;
          font-size: 11px;
          color: #888;
        }

        .code-textarea {
          flex: 1;
          background: #1e1e1e;
          color: #d4d4d4;
          border: none;
          padding: 16px;
          resize: none;
          outline: none;
        }

        .description-section {
          width: 300px;
          display: flex;
          flex-direction: column;
          background: #252526;
        }

        .description-textarea {
          flex: 1;
          background: #1e1e1e;
          color: #d4d4d4;
          border: none;
          padding: 16px;
          resize: none;
          outline: none;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .share-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .share-modal {
          background: #252526;
          border-radius: 8px;
          padding: 24px;
          width: 500px;
          max-width: 90vw;
        }

        .share-modal h3 {
          margin: 0 0 16px 0;
          color: #d4d4d4;
        }

        .share-link-container {
          display: flex;
          gap: 8px;
          margin: 16px 0;
        }

        .share-link-input {
          flex: 1;
          background: #3c3c3c;
          border: 1px solid #464647;
          color: #d4d4d4;
          padding: 8px 12px;
          border-radius: 4px;
        }

        .copy-btn {
          background: #0e639c;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .share-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
        }

        .btn-secondary {
          background: #464647;
          color: #d4d4d4;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .code-editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 20px;
          background: #007acc;
          color: white;
          font-size: 12px;
        }

        .saving-indicator {
          color: #f9c23c;
        }

        .unsaved-indicator {
          color: #f48771;
        }
      `}</style>
    </div>
  );
};