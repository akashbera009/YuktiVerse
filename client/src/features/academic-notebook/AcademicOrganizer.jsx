// ```jsx
import React, { useState } from 'react';
import { FaFolder, FaFolderOpen, FaFilePdf, FaImage, FaStickyNote, FaUpload, FaCog, FaTimes, FaPlus, FaStar } from 'react-icons/fa';
import Notebook from '../ai-notepad/Notebook';
import CreateMenu from './CreateMenu';
import './AcademicOrganizer.css';

const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

// Modified initialSubjects to include important flag
const initialSubjects = {
  'First Year': {
    subjects: [
      {
        name: 'Mathematics I',
        important: false,
        chapters: {
          'Chapter 1: Calculus': [
            { type: 'pdf', name: 'Calculus_Lecture1.pdf' },
            { type: 'image', name: 'Graph.png' },
            { type: 'notebook', name: 'Calculus Notes' },
          ],
          'Chapter 2: Algebra': [
            { type: 'pdf', name: 'Algebra_Lecture1.pdf' },
            { type: 'notebook', name: 'Algebra Notes' },
          ],
          'Important Notes': [
            { type: 'pdf', name: 'Math_Formulas.pdf' },
            { type: 'notebook', name: 'Key Notes' },
          ],
        },
      },
      {
        name: 'Physics',
        important: false,
        chapters: {
          'Chapter 1: Mechanics': [
            { type: 'pdf', name: 'Mechanics_Lecture1.pdf' },
            { type: 'image', name: 'Force_Diagram.png' },
          ],
          'Chapter 2: Thermodynamics': [
            { type: 'notebook', name: 'Thermo Notes' },
          ],
          'Important Notes': [
            { type: 'pdf', name: 'Physics_Summary.pdf' },
          ],
        },
      },
      {
        name: 'Chemistry',
        important: false,
        chapters: {
          'Chapter 1: Organic': [
            { type: 'pdf', name: 'Organic_Lecture1.pdf' },
            { type: 'pdf', name: 'Organic_Lecture2.pdf' },
            // { type: 'notebook', name: 'Organic_Lecture2.pdf' },
            { type: 'notebook', name: 'Firewall Notes' },
          ],
          'Chapter 2: Inorganic': [
            { type: 'notebook', name: 'Inorganic Notes' },
          ],
          'Important Notes': [
            { type: 'image', name: 'Periodic_Table.png' },
          ],
        },
      },
    ],
    important: false,
  },
  'Second Year': {
    subjects: [
      {
        name: 'Data Structures',
        important: false,
        chapters: {
          'Chapter 1: Arrays': [
            { type: 'pdf', name: 'Arrays_Lecture1.pdf' },
            { type: 'notebook', name: 'Array Notes' },
          ],
          'Chapter 2: Trees': [
            { type: 'image', name: 'Tree_Diagram.png' },
          ],
          'Important Notes': [
            { type: 'notebook', name: 'DS Key Notes' },
          ],
        },
      },
      {
        name: 'Discrete Math',
        important: false,
        chapters: {
          'Chapter 1: Sets': [
            { type: 'pdf', name: 'Sets_Lecture1.pdf' },
          ],
          'Chapter 2: Logic': [
            { type: 'notebook', name: 'Logic Notes' },
          ],
          'Important Notes': [
            { type: 'pdf', name: 'Logic_Summary.pdf' },
          ],
        },
      },
      {
        name: 'Electronics',
        important: false,
        chapters: {
          'Chapter 1: Circuits': [
            { type: 'image', name: 'Circuit_Diagram.png' },
          ],
          'Chapter 2: Signals': [
            { type: 'notebook', name: 'Signals Notes' },
          ],
          'Important Notes': [],
        },
      },
    ],
    important: false,
  },
  'Third Year': {
    subjects: [
      {
        name: 'Operating Systems',
        important: false,
        chapters: {
          'Chapter 1: Processes': [
            { type: 'pdf', name: 'Processes_Lecture1.pdf' },
          ],
          'Chapter 2: Memory': [
            { type: 'notebook', name: 'Memory Notes' },
          ],
          'Important Notes': [],
        },
      },
      {
        name: 'AI',
        important: false,
        chapters: {
          'Chapter 1: Machine Learning': [
            { type: 'pdf', name: 'ML_Lecture1.pdf' },
          ],
          'Chapter 2: Neural Networks': [
            { type: 'notebook', name: 'NN Notes' },
          ],
          'Important Notes': [],
        },
      },
      {
        name: 'Networks',
        important: false,
        chapters: {
          'Chapter 1: Protocols': [
            { type: 'pdf', name: 'Protocols_Lecture1.pdf' },
          ],
          'Chapter 2: Security': [
            { type: 'notebook', name: 'Security Notes' },
          ],
          'Important Notes': [],
        },
      },
    ],
    important: false,
  },
  'Fourth Year': {
    subjects: [
      {
        name: 'Project',
        important: false,
        chapters: {
          'Chapter 1: Planning': [
            { type: 'pdf', name: 'Plan_Document.pdf' },
          ],
          'Chapter 2: Execution': [
            { type: 'notebook', name: 'Execution Notes' },
          ],
          'Important Notes': [],
        },
      },
      {
        name: 'Cloud Computing',
        important: false,
        chapters: {
          'Chapter 1: AWS': [
            { type: 'pdf', name: 'AWS_Lecture1.pdf' },
          ],
          'Chapter 2: Azure': [
            { type: 'notebook', name: 'Azure Notes' },
          ],
          'Important Notes': [],
        },
      },
      {
        name: 'Security',
        important: false,
        chapters: {
          'Chapter 1: Cryptography': [
            { type: 'pdf', name: 'Crypto_Lecture1.pdf' },
          ],
          'Chapter 2: Firewalls': [
            { type: 'notebook', name: 'Firewall Notes' },
          ],
          'Important Notes': [],
        },
      },
    ],
    important: false,
  },
};
const templates = ['CSE Syllabus', 'ECE Syllabus', 'BCA Syllabus'];

const ContextMenu = ({ x, y, onDelete, onToggleImportant, isImportant, onClose }) => {
  return (
    <div className="ao-context-menu" style={{ top: y, left: x }}>
      <button
        className="ao-context-menu-item"
        onClick={onToggleImportant}
      >
        <FaStar className="ao-context-icon" />
        {isImportant ? 'Remove Important' : 'Make Important'}
      </button>
      <button
        className="ao-context-menu-item ao-context-delete"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

const AcademicOrganizer = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [data, setData] = useState(initialSubjects);
  const [newItemName, setNewItemName] = useState('');
  const [creatingType, setCreatingType] = useState(null); // 'year', 'subject:<year>', 'chapter:<year>:<subject>'
  const [contextMenu, setContextMenu] = useState(null);

  // Get files for the selected chapter
  const getFilesForChapter = () => {
    if (selectedYear && selectedSubject && selectedChapter) {
      const subject = data[selectedYear].subjects.find((s) => s.name === selectedSubject);
      return subject?.chapters[selectedChapter] || [];
    }
    return [];
  };

  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null);
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSelectedFile(null);
    } else {
      setSelectedYear(year);
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSelectedFile(null);
    }
  };

  const handleSubjectClick = (subject) => {
    if (selectedSubject === subject) {
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSelectedFile(null);
    } else {
      setSelectedSubject(subject);
      setSelectedChapter(null);
      setSelectedFile(null);
    }
  };

  const handleChapterClick = (chapter) => {
    if (selectedChapter === chapter) {
      setSelectedChapter(null);
      setSelectedFile(null);
    } else {
      setSelectedChapter(chapter);
      setSelectedFile(null);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleCloseFile = () => {
    setSelectedFile(null);
  };

  // Handle creation of folders, notes, or uploads (from CreateMenu)
  const handleCreate = (type, payload) => {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const year = selectedYear;
      const subj = selectedSubject;
      const chap = selectedChapter;
      if (!year || !subj) return prev;

      const subject = clone[year].subjects.find((s) => s.name === subj);
      if (!subject) return prev;

      if (type === 'folder') {
        subject.chapters[payload] = {};
      } else if (type === 'note' || type === 'upload') {
        if (!chap) return prev;
        const fileType = type === 'note' ? 'notebook' : payload.name.split('.').pop().toLowerCase() === 'pdf' ? 'pdf' : 'image';
        subject.chapters[chap] = [
          ...(subject.chapters[chap] || []),
          { type: fileType, name: type === 'note' ? payload : payload.name },
        ];
      }
      return clone;
    });
  };

  // Handle creation of years, subjects, or chapters
  const handleCreateItem = () => {
    if (!newItemName.trim()) return;

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (creatingType === 'year') {
        if (!newData[newItemName]) {
          newData[newItemName] = { subjects: [], important: false };
          years.push(newItemName);
        }
      } else if (creatingType.startsWith('subject:') && selectedYear) {
        if (!newData[selectedYear].subjects.find((s) => s.name === newItemName)) {
          newData[selectedYear].subjects.push({ name: newItemName, important: false, chapters: {} });
        }
      } else if (creatingType.startsWith('chapter:') && selectedYear && selectedSubject) {
        const subject = newData[selectedYear].subjects.find((s) => s.name === selectedSubject);
        if (subject && !subject.chapters[newItemName]) {
          subject.chapters[newItemName] = [];
        }
      }
      return newData;
    });

    setNewItemName('');
    setCreatingType(null);
  };

  // Handle deletion of years, subjects, or chapters
  const handleDeleteItem = (type, year, subject, chapter) => {
    if (!window.confirm(`Are you sure you want to delete ${type === 'year' ? year : type === 'subject' ? subject : chapter}?`)) {
      return;
    }

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (type === 'year') {
        delete newData[year];
        if (selectedYear === year) {
          setSelectedYear(null);
          setSelectedSubject(null);
          setSelectedChapter(null);
          setSelectedFile(null);
        }
      } else if (type === 'subject') {
        newData[year].subjects = newData[year].subjects.filter((s) => s.name !== subject);
        if (selectedYear === year && selectedSubject === subject) {
          setSelectedSubject(null);
          setSelectedChapter(null);
          setSelectedFile(null);
        }
      } else if (type === 'chapter') {
        const subj = newData[year].subjects.find((s) => s.name === subject);
        if (subj) {
          delete subj.chapters[chapter];
          if (selectedYear === year && selectedSubject === subject && selectedChapter === chapter) {
            setSelectedChapter(null);
            setSelectedFile(null);
          }
        }
      }
      return newData;
    });
    setContextMenu(null);
  };

  // Handle toggling important status
  const handleToggleImportant = (type, year, subject, chapter) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (type === 'year') {
        newData[year].important = !newData[year].important;
      } else if (type === 'subject') {
        const subj = newData[year].subjects.find((s) => s.name === subject);
        if (subj) subj.important = !subj.important;
      } else if (type === 'chapter') {
        const subj = newData[year].subjects.find((s) => s.name === subject);
        if (subj) {
          const chapterData = subj.chapters[chapter];
          if (chapterData) {
            subj.chapters[chapter] = { files: chapterData, important: !chapterData.important };
          }
        }
      }
      return newData;
    });
    setContextMenu(null);
  };

  // Handle right-click to show context menu
  const handleContextMenu = (e, type, year, subject, chapter, isImportant) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      year,
      subject,
      chapter,
      isImportant,
    });
  };

  // Close context menu on click elsewhere
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Construct full file path for heading
  const getFullPath = () => {
    const pathParts = [];
    if (selectedYear) pathParts.push(selectedYear);
    if (selectedSubject) pathParts.push(selectedSubject);
    if (selectedChapter) pathParts.push(selectedChapter);
    if (selectedFile) pathParts.push(selectedFile.name);
    return pathParts.join(' > ') || 'Select a Year';
  };

  // Sort items by important status
  const getSortedYears = () => {
    return Object.keys(data).sort((a, b) => {
      if (data[a].important && !data[b].important) return -1;
      if (!data[a].important && data[b].important) return 1;
      return a.localeCompare(b);
    });
  };

  const getSortedSubjects = (year) => {
    return data[year].subjects.sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const getSortedChapters = (year, subjectName) => {
    const subject = data[year].subjects.find((s) => s.name === subjectName);
    if (!subject) return [];
    return Object.keys(subject.chapters).sort((a, b) => {
      const aImportant = subject.chapters[a].important || false;
      const bImportant = subject.chapters[b].important || false;
      if (aImportant && !bImportant) return -1;
      if (!aImportant && bImportant) return 1;
      return a.localeCompare(b);
    });
  };

  return (
    <div className="ao-container" onClick={handleCloseContextMenu}>
      {/* Sidebar */}
      <div className="ao-sidebar">
        <h2 className="ao-title">Academic Organizer</h2>
        {getSortedYears().map((year) => (
          <div key={year} className="ao-section">
            <button
              className={`ao-button ${selectedYear === year ? 'active' : ''} ${data[year].important ? 'ao-important' : ''}`}
              onClick={() => handleYearClick(year)}
              onContextMenu={(e) => handleContextMenu(e, 'year', year, null, null, data[year].important)}
            >
             
              {selectedYear === year ? (
                <FaFolderOpen className="ao-icon" />
              ) : (
                <FaFolder className="ao-icon" />
              )}
              {year} {data[year].important && <FaStar className="ao-icon ao-important-icon" />}
            </button>
            {selectedYear === year && (
              <div className="ao-subsection">
                {getSortedSubjects(year).map((subj) => (
                  <div key={subj.name} className="ao-subitem">
                    <button
                      className={`ao-button ao-subbutton ${selectedSubject === subj.name ? 'active' : ''} ${subj.important ? 'ao-important' : ''}`}
                      onClick={() => handleSubjectClick(subj.name)}
                      onContextMenu={(e) => handleContextMenu(e, 'subject', year, subj.name, null, subj.important)}
                    >
                     
                      {selectedSubject === subj.name ? (
                        <FaFolderOpen className="ao-icon" />
                      ) : (
                        <FaFolder className="ao-icon" />
                      )}
                      {subj.name}
                       {subj.important && <FaStar className="ao-icon ao-important-icon" />}
                    </button>
                    {selectedSubject === subj.name && (
                      <div className="ao-subsection">
                        {getSortedChapters(year, subj.name).map((chapter) => (
                          <div key={chapter} className="ao-subitem">
                            <button
                              className={`ao-button ao-subbutton ${selectedChapter === chapter ? 'active' : ''} ${subj.chapters[chapter].important ? 'ao-important' : ''}`}
                              onClick={() => handleChapterClick(chapter)}
                              onContextMenu={(e) => handleContextMenu(e, 'chapter', year, subj.name, chapter, subj.chapters[chapter].important || false)}
                            >
                             
                              {selectedChapter === chapter ? (
                                <FaFolderOpen className="ao-icon" />
                              ) : (
                                <FaFolder className="ao-icon" />
                              )}
                              {chapter } {(subj.chapters[chapter].important || false) && <FaStar className="ao-icon ao-important-icon" />}
                            </button>
                          </div>
                        ))}
                        <div className="ao-create-section">
                          {creatingType === `chapter:${year}:${subj.name}` ? (
                            <div className="ao-create-input">
                              <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Enter chapter name"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
                              />
                              {/* <button onClick={handleCreateItem}>Create</button>
                              <button onClick={() => setCreatingType(null)}>Cancel</button> */}
                            </div>
                          ) : (
                            <button
                              className="ao-create-button"
                              onClick={() => setCreatingType(`chapter:${year}:${subj.name}`)}
                            >
                              <FaPlus /> Create New Chapter
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="ao-create-section">
                  {creatingType === `subject:${year}` ? (
                    <div className="ao-create-input">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Enter subject name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
                      />
                      {/* <button onClick={handleCreateItem}>Create</button>
                      <button onClick={() => setCreatingType(null)}>Cancel</button> */}
                    </div>
                  ) : (
                    <button
                      className="ao-create-button"
                      onClick={() => setCreatingType(`subject:${year}`)}
                    >
                      <FaPlus /> Create New Subject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="ao-create-section">
          {creatingType === 'year' ? (
            <div className="ao-create-input">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter year name"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
              />
              {/* <button onClick={handleCreateItem}>Create</button>
              <button onClick={() => setCreatingType(null)}>Cancel</button> */}
            </div>
          ) : (
            <button
              className="ao-create-button"
              onClick={() => setCreatingType('year')}
            >
              <FaPlus /> Create New Year
            </button>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="ao-main">
        <h3 className="ao-heading">
          {getFullPath()}
          {selectedFile && (
            <button className="ao-close-btn" onClick={handleCloseFile}>
              <FaTimes />
            </button>
          )}
        </h3>
        <div className="ao-actions">
          <CreateMenu onCreate={handleCreate} />
          <select
            className="ao-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {templates.map((tpl) => (
              <option key={tpl} value={tpl}>
                {tpl}
              </option>
            ))}
          </select>
          <button className="ao-action-btn outline">
            <FaCog className="ao-icon" /> Customize
          </button>
        </div>
        {selectedFile ? (
          <div className="ao-file-content-container">
            {selectedFile.type === 'notebook' ? (
              <Notebook />
            ) : selectedFile.type === 'pdf' ? (
              <div className="ao-file-content">
                <p>Viewing PDF: {selectedFile.name}</p>
                <p>(PDF rendering requires a library like react-pdf)</p>
              </div>
            ) : selectedFile.type === 'image' ? (
              <div className="ao-file-content">
                <img
                  src={`https://via.placeholder.com/600x400?text=${encodeURIComponent(selectedFile.name)}`}
                  alt={selectedFile.name}
                  className="ao-image"
                />
              </div>
            ) : null}
          </div>
        ) : selectedChapter ? (
          <div className="ao-files-grid">
            {getFilesForChapter().map((file) => (
              <div
                key={file.name}
                className="ao-file-card"
                onClick={() => handleFileClick(file)}
              >
                <div className="ao-file-icon">
                  {file.type === 'pdf' && <FaFilePdf className="ao-icon" />}
                  {file.type === 'image' && <FaImage className="ao-icon" />}
                  {file.type === 'notebook' && <FaStickyNote className="ao-icon" />}
                </div>
                <div className="ao-file-name">{file.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ao-content-placeholder">
            {selectedYear && selectedSubject ? (
              <p>Select a chapter to view files</p>
            ) : (
              <p>Select a year and subject to view files</p>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => handleDeleteItem(contextMenu.type, contextMenu.year, contextMenu.subject, contextMenu.chapter)}
          onToggleImportant={() => handleToggleImportant(contextMenu.type, contextMenu.year, contextMenu.subject, contextMenu.chapter)}
          isImportant={contextMenu.isImportant}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

export default AcademicOrganizer;
// ```