import React, { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFilePdf, FaImage, FaStickyNote, FaPlus, FaStar, FaTrash, FaSearch, FaBars, FaTimes,FaEdit ,FaArrowsAlt } from 'react-icons/fa';
import './AcademicOrganizer.css';
import NewModal from "./NewModal"
import NotebookEditor from "./NotebookEditor"
import RenamePrompt from "./RenamePrompt"
import MoveModal from "./MoveModal"
import ContextMenu from './ContextMenu';
import Notebook from '../ai-notepad/Notebook';

const STORAGE_KEY = 'academicOrganizerData';

const AcademicOrganizer = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [recentFiles, setRecentFiles] = useState([]);
  const [importantFiles, setImportantFiles] = useState([]);
  const [creatingType, setCreatingType] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmText, setConfirmText] = useState('');

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [moving, setMoving] = useState(null);
  const [renaming, setRenaming] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [showSearchResults, setShowSearchResults] = useState(false);


const [data, setData] = useState(() => {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : {
    'First Year': {
      subjects: [
        {
          name: 'Mathematics I',
          important: true,
          chapters: {
            'Chapter 1: Calculus': [
              { type: 'pdf', name: 'Calculus_Lecture1.pdf' },
              { type: 'image', name: 'Graph.png' },
              { type: 'notebook', name: 'Math Notes 3' },
            ],
            'Chapter 2: Algebra': [
              { type: 'pdf', name: 'Algebra_Lecture1.pdf' },
              { type: 'notebook', name: 'Math Note 4' },
            ]
          }
        },
        {
          name: 'Physics',
          important: false,
          chapters: {
            'Chapter 1: Mechanics': [
              { type: 'pdf', name: 'Mechanics_Lecture1.pdf' },
              { type: 'image', name: 'Force_Diagram.png' },
            ]
          }
        }
      ]
    },
     'Second Year': {
    subjects: [
      {
        name: 'Data Structures',
        important: false,
        chapters: {
          'Chapter 1: Arrays': [
            { type: 'pdf', name: 'Arrays_Lecture1.pdf' },
            {
              type: 'notebook',
              name: 'Array Notes',
              note_id: 'array-notes-1',
              content: {
                textBoxes: [
                  {
                    id: 'box1',
                    text: 'Array operations',
                    x: 70,
                    y: 30,
                    width: 180,
                    height: 60,
                  },
                ],
              },
            },
          ],
          'Chapter 2: Trees': [
            { type: 'image', name: 'Tree_Diagram.png' },
          ],
          'Important Notes': [
            {
              type: 'notebook',
              name: 'DS Key Notes',
              note_id: 'ds-notes-1',
              content: {
                textBoxes: [
                  {
                    id: 'box1',
                    text: 'Key points about trees and graphs',
                    x: 100,
                    y: 40,
                    width: 190,
                    height: 70,
                  },
                ],
              },
            },
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
            {
              type: 'notebook',
              name: 'Logic Notes',
              note_id: 'logic-notes-1',
              content: {
                textBoxes: [
                  {
                    id: 'box1',
                    text: 'Truth tables and logic gates',
                    x: 90,
                    y: 55,
                    width: 160,
                    height: 60,
                  },
                ],
              },
            },
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
            {
              type: 'notebook',
              name: 'Signals Notes',
              note_id: 'signals-notes-1',
              content: {
                textBoxes: [
                  {
                    id: 'box1',
                    text: 'Analog and digital signals',
                    x: 80,
                    y: 35,
                    width: 170,
                    height: 60,
                  },
                ],
              },
            },
          ],
          'Important Notes': [],
        },
      },
    ],
    important: false,
  },
  };
});


  // on every data change: persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);



useEffect(() => {
  axios.get('/years')
    .then(res => setYears(res.data))
    .catch(console.error)
}, [])


const handleSubjectClick = async (subject: Subject) => {
  setSelectedSubject(subject);
  setSelectedChapter(null);

  const res = await axios.get(`/years/subjects/${subject._id}/chapters`);
  // update state:
  setYears(y =>
    y.map(year =>
      year._id === selectedYear._id
        ? {
            ...year,
            subjects: year.subjects.map(s =>
              s._id === subject._id
                ? { ...s, chapters: res.data }
                : s
            )
          }
        : year
    )
  );
};



const handleChapterClick = async (chapter: Chapter) => {
  setSelectedChapter(chapter);
  // fetch materials:
  const res = await axios.get(`/years/${chapter._id}/materials`);
  setYears(y =>
    y.map(year =>
      year._id === selectedYear._id
        ? {
            ...year,
            subjects: year.subjects.map(s =>
              s._id === selectedSubject._id
                ? {
                    ...s,
                    chapters: s.chapters.map(c =>
                      c._id === chapter._id
                        ? { ...c, materials: res.data }
                        : c
                    )
                  }
                : s
            )
          }
        : year
    )
  );
};


  // // Handle file selection
  // const handleFileClick = (file) => {
  //   setSelectedFile(file);
  //   // Add to recent files
  //   setRecentFiles(prev => [
  //     { ...file, timestamp: new Date() },
  //     ...prev.filter(f => f.name !== file.name).slice(0, 4)
  //   ]);
  // };

  const handleFileClick = async (file) => {
  setSelectedFile(file);

  // Track as a recent file
  setRecentFiles(prev => [
    { ...file, timestamp: new Date() },
    ...prev.filter(f => f.id !== file.id).slice(0, 4)
  ]);

  // Determine file type
  if (file.type === 'notebook') {
    try {
      const response = await axios.get(`/api/notebooks/${file.id}`);
      setNotebookContent(response.data); // Assuming you have this state
      setViewerType('notebook'); // Could trigger NotebookEditor or NotebookViewer
    } catch (error) {
      console.error('Failed to load notebook:', error);
    }
  } else if (file.type === 'handwritten') {
    setViewerType('pdf'); // Could trigger PDF viewer
    // You might store the file path or blob here
  } else {
    console.warn('Unknown file type clicked:', file.type);
  }
};


  // Handle closing file view
  const handleCloseFile = () => {
    setSelectedFile(null);
  };


const handleCreateYear = async (title) => {
  const res = await axios.post('/years', { title, important: false });
  setYears(prev => [...prev, { ...res.data, subjects: [] }]);
};


const handleCreateSubject = async (name) => {
  const res = await axios.post(
    `/years/${selectedYear._id}/subjects`,
    { name, important: false }
  );
  setYears(y =>
    y.map(yr =>
      yr._id === selectedYear._id
        ? { ...yr, subjects: [...yr.subjects, { ...res.data, chapters: [] }] }
        : yr
    )
  );
};
const handleCreateChapter = async (chapterTitle) => {
  const res = await axios.post(
    `/years/subjects/${selectedSubject._id}/chapters`,
    { chapterTitle }
  );
  setYears(y =>
    y.map(yr =>
      yr._id === selectedYear._id
        ? {
            ...yr,
            subjects: yr.subjects.map(s =>
              s._id === selectedSubject._id
                ? { ...s, chapters: [...s.chapters, { ...res.data, materials: [] }] }
                : s
            )
          }
        : yr
    )
  );
};
const handleCreateNotebook = async () => {
  const payload = {
    note_id: `note_${Date.now()}`, // or let backend generate it
    name: `Untitled Note ${Date.now()}`,
    chapter: selectedChapter._id,
    content: { textBoxes: [] },
  };
  const res = await axios.post('/api/notebooks', payload);
  // res.data is your new FileObject
  setYears(y =>
    y.map(yr =>
      yr._id === selectedYear._id
        ? {
            ...yr,
            subjects: yr.subjects.map(s =>
              s._id === selectedSubject._id
                ? {
                    ...s,
                    chapters: s.chapters.map(c =>
                      c._id === selectedChapter._id
                        ? { ...c, materials: [...c.materials, res.data] }
                        : c
                    )
                  }
                : s
            )
          }
        : yr
    )
  );
};



const handleDeleteFile = async (file) => {
  if (file.type === 'notebook') {
    await axios.delete(`/api/notebooks/${file.note_id}`);
  }
  // then prune locally:
  setYears(y =>
    y.map(yr =>
      yr._id === selectedYear._id
        ? {
            ...yr,
            subjects: yr.subjects.map(s =>
              s._id === selectedSubject._id
                ? {
                    ...s,
                    chapters: s.chapters.map(c =>
                      c._id === selectedChapter._id
                        ? {
                            ...c,
                            materials: c.materials.filter(m =>
                              m.type === 'notebook'
                                ? m.note_id !== file.note_id
                                : m.name !== file.name
                            )
                          }
                        : c
                    )
                  }
                : s
            )
          }
        : yr
    )
  );
};


const handleDeleteItem = async (type, nameOrId) => {
  // If it's a notebook, delete from backend first
  if (type === 'file') {
    const subj = data[selectedYear].subjects.find(s => s.name === selectedSubject);
    const arr = subj.chapters[selectedChapter];
    const file = arr.find(f =>
      f.type === 'notebook'
        ? f.note_id === nameOrId
        : f.name === nameOrId
    );
    if (file?.type === 'notebook') {
      try {
        await axios.delete(`/api/notebooks/${file.note_id}`);
      } catch (err) {
        console.error("Failed to delete notebook:", err);
      }
    }
  }

  // Then update local state
  setData(prev => {
    const newData = { ...prev };
    const subj = newData[selectedYear].subjects.find(s => s.name === selectedSubject);

    if (type === 'file') {
      subj.chapters[selectedChapter] = subj.chapters[selectedChapter].filter(f =>
        f.type === 'notebook'
          ? f.note_id !== nameOrId
          : f.name !== nameOrId
      );
      if (selectedFile?.note_id === nameOrId || selectedFile?.name === nameOrId) {
        setSelectedFile(null);
      }
    }
    // ... handle year / subject / chapter deletes as you already have ...
    return newData;
  });

  setDeleteTarget(null);
};


  // Handle toggling important status
  const handleToggleImportant = (file) => {
    setImportantFiles(prev => {
      if (prev.some(f => f.name === file.name)) {
        return prev.filter(f => f.name !== file.name);
      } else {
        return [...prev, { ...file, important: true }];
      }
    });
  };

  // Handle context menu
  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      item
    });
  };

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Get full path for breadcrumb
  const getFullPath = () => {
    const path = [];
    if (selectedYear) path.push(selectedYear);
    if (selectedSubject) path.push(selectedSubject);
    if (selectedChapter) path.push(selectedChapter);
    if (selectedFile) path.push(selectedFile.name);
    return path.join(' / ');
  };

  // Filter files based on search
  const filteredFiles = () => {
    if (!searchTerm) return getFilesForChapter();
    return getFilesForChapter().filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };


// upload purpose
  const handleUploadFile = (file, type) => {
  const reader = new FileReader();
  reader.onload = () => {
    const fileObj = { type, name: file.name, dataUrl: reader.result };
    // insert into data[selectedYear][selectedSubject][selectedChapter]
    setData(d => {
      const newData = { ...d };
      const subj = newData[selectedYear].subjects
                    .find(s => s.name === selectedSubject);
      subj.chapters[selectedChapter] = [
        ...subj.chapters[selectedChapter],
        fileObj
      ];
      return newData;
    });
    setShowNewModal(false);
  };
  reader.readAsDataURL(file);
};

const handleSaveNotebook = async (notebook) => {
  const res = await axios.put(
    `/api/notebooks/${notebook.note_id}`,
    { ...notebook, user: req.user._id }
  );
  const updated = res.data;
  setYears(y =>
    y.map(yr =>
      yr._id === selectedYear._id
        ? {
            ...yr,
            subjects: yr.subjects.map(s =>
              s._id === selectedSubject._id
                ? {
                    ...s,
                    chapters: s.chapters.map(c =>
                      c._id === selectedChapter._id
                        ? {
                            ...c,
                            materials: c.materials.map(m =>
                              m.type === 'notebook' && m.note_id === updated.note_id
                                ? updated
                                : m
                            )
                          }
                        : c
                    )
                  }
                : s
            )
          }
        : yr
    )
  );
};



// Renames a year / subject / chapter / file in your data tree
const handleRename = newName => {
  setData(d => {
    const nd = { ...d };
    const { type, item } = renaming;

    if (type === 'file') {
      // rename a file
      const subj = nd[selectedYear].subjects.find(s => s.name === selectedSubject);
      subj.chapters[selectedChapter] = subj.chapters[selectedChapter].map(f =>
        f === item ? { ...f, name: newName } : f
      );

    } else if (type === 'chapter') {
      // rename a chapter
      const subj = nd[selectedYear].subjects.find(s => s.name === selectedSubject);
      subj.chapters[newName] = subj.chapters[selectedChapter];
      delete subj.chapters[selectedChapter];
      setSelectedChapter(newName);

    } else if (type === 'subject') {
      // rename a subject
      const yearObj = nd[selectedYear];
      const sub = yearObj.subjects.find(s => s.name === item);
      sub.name = newName;
      setSelectedSubject(newName);

    } else if (type === 'year') {
      // rename a year
      nd[newName] = nd[item];
      delete nd[item];
      setSelectedYear(newName);
    }

    return nd;
  });

  setRenaming(null);
};

// Moves a file from the currently selected chapter into dest.year/dest.subject/dest.chapter
const handleMove = dest => {
  setData(d => {
    const nd = { ...d };

    // remove from old
    const fromSubj = nd[selectedYear].subjects.find(s => s.name === selectedSubject);
    fromSubj.chapters[selectedChapter] =
      fromSubj.chapters[selectedChapter].filter(f => f !== moving);

    // add to new
    const toSubj = nd[dest.year].subjects.find(s => s.name === dest.subject);
    toSubj.chapters[dest.chapter] = [
      ...(toSubj.chapters[dest.chapter] || []),
      moving
    ];

    return nd;
  });

  setMoving(null);
  setContextMenu(null);
};

  return (
    <div className={`ao-container ${sidebarOpen ? '' : 'collapsed'}`} onClick={handleCloseContextMenu}>
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-left">
          <button className="nav-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          <div className="app-name">Academic Organizer</div>
        </div>
        
        <div className="nav-center">
          <div className="tabs">

            <button 
              className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
            <button 
              className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent
            </button>
            <button 
              className={`tab ${activeTab === 'important' ? 'active' : ''}`}
              onClick={() => setActiveTab('important')}
            >
              Important
            </button>
          </div>
        </div>
        
              {/* <div className="nav-right">
                <div className="search-bar">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div> */}
              <div className="global-search-container">
                
 <div className="search-input-container">
  <FaSearch className="search-icon" />
  <input
    className="global-search-bar"
    placeholder="Search all files..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    onFocus={() => setShowSearchResults(true)}
    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
  />
</div>

  {/* 🔍 Search Results Popup */}
  {showSearchResults && searchTerm.trim() !== '' && (
    <div className="global-search-results">
      {Object.entries(data).flatMap(([year, { subjects }]) =>
        subjects.flatMap(subj =>
          Object.entries(subj.chapters).flatMap(([chap, files]) =>
            files
              .filter(f =>
                f.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(f => (
                <div
                  key={`${year}/${subj.name}/${chap}/${f.name}`}
                  className="search-result-item"
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedSubject(subj.name);
                    setSelectedChapter(chap);
                    setSearchTerm('');
                    setShowSearchResults(false);
                    handleFileClick(f); // opens the file (already exists)
                  }}
                >
                  <div className="search-result-icon">
                    {f.type === 'pdf' && <FaFilePdf />}
                    {f.type === 'image' && <FaImage />}
                    {f.type === 'notebook' && <FaStickyNote />}
                  </div>
                  <div className="search-result-name">{f.name}</div>
                  <div className="search-result-path">{`${year} / ${subj.name} / ${chap}`}</div>
                </div>
              ))
          )
        )
      )}

      {Object.entries(data).flatMap(([year, { subjects }]) =>
        subjects.flatMap(subj =>
          Object.entries(subj.chapters).flatMap(([chap, files]) =>
            files.filter(f =>
              f.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        )
      ).length === 0 && (
        <div className="no-results">No matching files found.</div>
      )}
    </div>
  )}
</div>
      </div>

      {/* Sidebar */}
   <div className={`ao-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Academic Notes</h2>
        </div>
        
        <div className="sidebar-content">
          {Object.keys(data).map(year => (
            <div key={year} className="ao-section">
              <button
                className={`ao-button ${selectedYear === year ? 'active' : ''}`}
                onClick={() => handleYearClick(year)}
                onContextMenu={(e) => handleContextMenu(e, 'year', year)}
              >
                {selectedYear === year ? (
                  <FaFolderOpen className="ao-icon" />
                ) : (
                  <FaFolder className="ao-icon" />
                )}
                {year}
              </button>
              
              {selectedYear === year && (
                <div className="ao-subsection">
                  {data[year].subjects.map(subject => (
                    <div key={subject.name} className="ao-subitem">
                      <button
                        className={`ao-button ao-subbutton ${selectedSubject === subject.name ? 'active' : ''}`}
                        onClick={() => handleSubjectClick(subject.name)}
                        onContextMenu={(e) => handleContextMenu(e, 'subject', subject.name)}
                      >
                        {selectedSubject === subject.name ? (
                          <FaFolderOpen className="ao-icon" />
                        ) : (
                          <FaFolder className="ao-icon" />
                        )}
                        {subject.name}
                      </button>
                      
                      {selectedSubject === subject.name && (
                        <div className="ao-subsection">
                          {Object.keys(subject.chapters).map(chapter => (
                            <div key={chapter} className="ao-subitem">
                              <button
                                className={`ao-button ao-subbutton ${selectedChapter === chapter ? 'active' : ''}`}
                                onClick={() => handleChapterClick(chapter)}
                                onContextMenu={(e) => handleContextMenu(e, 'chapter', chapter)}
                              >
                                {selectedChapter === chapter ? (
                                  <FaFolderOpen className="ao-icon" />
                                ) : (
                                  <FaFolder className="ao-icon" />
                                )}
                                {chapter}
                              </button>
                            </div>
                          ))}
                          
                          {/* Create Chapter Button */}
                          <div className="ao-create-section">
{creatingType === `chapter:${selectedSubject._id}` ? (
  <div className="ao-create-input">
    <input
      value={newItemName}
      onChange={e => setNewItemName(e.target.value)}
      onKeyDown={async e => {
        if (e.key==='Enter' && newItemName.trim()) {
          await handleCreateChapter(newItemName.trim());
          setNewItemName('');
          setCreatingType(null);
        }
        if (e.key==='Escape') setCreatingType(null);
      }}
      placeholder="Enter chapter title"
      autoFocus
    />
  </div>
) : (
  <button
    className="ao-create-button"
    onClick={() => {
      setCreatingType(`chapter:${selectedSubject._id}`);
      setNewItemName('');
    }}
  >
    <FaPlus /> New Chapter
  </button>
)}

                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Create Subject Button */}
                  <div className="ao-create-section">
{creatingType === `subject:${selectedYear._id}` ? (
  <div className="ao-create-input">
    <input
      value={newItemName}
      onChange={e => setNewItemName(e.target.value)}
      onKeyDown={async e => {
        if (e.key==='Enter' && newItemName.trim()) {
          await handleCreateSubject(newItemName.trim());
          setNewItemName('');
          setCreatingType(null);
        }
        if (e.key==='Escape') setCreatingType(null);
      }}
      placeholder="Enter subject name"
      autoFocus
    />
  </div>
) : (
  <button
    className="ao-create-button ao-subbutton"
    onClick={() => {
      setCreatingType(`subject:${selectedYear._id}`);
      setNewItemName('');
    }}
  >
    <FaPlus /> New Subject
  </button>
)}

                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Create Year Button */}
          <div className="ao-create-section">
            {/* {creatingType === 'year' ? (
              <div className="ao-create-input">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter year name"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
                />
                <button onClick={handleCreateItem}>Create</button>
                <button onClick={() => setCreatingType(null)}>Cancel</button>
              </div>
            ) : (
              <button
                className="ao-create-button"
                onClick={() => setCreatingType('year')}
              >
                <FaPlus /> Create New Folder
              </button>
            )} */}

  {creatingType === 'year' ? (
  <div className="ao-create-input">
    <input
      value={newItemName}
      onChange={e => setNewItemName(e.target.value)}
      onKeyDown={async e => {
        if (e.key === 'Enter' && newItemName.trim()) {
          await handleCreateYear(newItemName.trim());
          setNewItemName('');
          setCreatingType(null);
        }
        if (e.key === 'Escape') {
          setCreatingType(null);
        }
      }}
      placeholder="Enter year name"
      autoFocus
    />
  </div>
) : (
  <button
    className="ao-create-button"
    onClick={() => {
      setCreatingType('year');
      setNewItemName('');
    }}
  >
    <FaPlus /> Create New Year
  </button>
)}

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ao-main">
        <div className="main-header">
          <div className="breadcrumb">
            {getFullPath() || 'Select a folder to begin'}
          </div>
          
          <div className="actions">
            <button className="action-btn" onClick={() => setShowNewModal(true)}>
              <FaPlus /> New
            </button>
            {showNewModal && (
<NewModal
  onClose={() => setShowNewModal(false)}
  onUploadFile={handleUploadFile}      // if you add an API for PDFs/images
  onCreateNotebook={async () => {
    await handleCreateNotebook();
    setShowNewModal(false);
  }}
/>

            )}
          </div>
        </div>
        
        {activeTab === 'recent' && (
          <div className="recent-files">
            <h3>Recently Accessed Files</h3>
            <div className="recent-grid">
              {recentFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="recent-card"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="file-icon">
                    {file.type === 'pdf' && <FaFilePdf />}
                    {file.type === 'image' && <FaImage />}
                    {file.type === 'notebook' && <FaStickyNote />}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-date">Today</div>
                  </div>
                </div>
              ))}
              {recentFiles.length === 0 && (
                <div className="empty-state">
                  No recently accessed files
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'important' && (
          <div className="important-files">
            <h3>Important Files</h3>
            <div className="ao-files-grid">
              {importantFiles.map((file, index) => (
                <div
                  key={index}
                  className="ao-file-card"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="file-icon-container">
                    <div className="file-icon">
                      {file.type === 'pdf' && <FaFilePdf />}
                      {file.type === 'image' && <FaImage />}
                      {file.type === 'notebook' && <FaStickyNote />}
                    </div>
                    <button 
                      className="file-action-btn active"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleImportant(file);
                      }}
                    >
                      <FaStar />
                    </button>
                  </div>
                  <div className="ao-file-name">{file.name}</div>
                </div>
              ))}
              {importantFiles.length === 0 && (
                <div className="empty-state">
                  No important files marked yet
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && selectedFile ? (
          <div className="file-content-container">
            <div className="file-header">
              <h3>{selectedFile.name}</h3>
              <button className="close-btn" onClick={handleCloseFile}>
                <FaTimes />
              </button>
            </div>
            <div className="file-content">
              {selectedFile.type === 'pdf' ? (
                <div className="pdf-preview">
                  <FaFilePdf className="preview-icon" />
                  <p>PDF content would be displayed here</p>
                </div>
              ) : selectedFile.type === 'image' ? (
                <div className="image-preview">
                  <div className="placeholder-image" />
                </div>
              ) : (
                <div className="notebook-preview">
                  {/* <p>Notebook content would be displayed here</p> */}

{selectedFile.type === 'notebook' && (
  // <div className="notebook-preview">
  //   <button onClick={() => setEditingNote(selectedFile)}>
  //     <FaPlus/> Edit Note
  //   </button>
  // </div>
    <Notebook 
                notebookId={selectedFile.note_id} 
                notebookName={selectedFile.name}
                onSave={handleSaveNotebook}
              />
)}

{editingNote && (
  // <NotebookEditor
  //   note={editingNote}
  //   onSave={handleSaveNote}
  //   onClose={() => setEditingNote(null)}
  // />
   <Notebook 
                notebookId={selectedFile.note_id} 
                notebookName={selectedFile.name}
                onSave={handleSaveNotebook}
              />
              
)}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'notes' && (
          <div className="content-area">
            <div className="files-section">
              <div className="section-header">
                <h3>{selectedChapter || 'Files'}</h3>
                <span>{filteredFiles().length} items</span>
              </div>
              
              <div className="ao-files-grid">
                {filteredFiles().map((file, index) => (
                  <div
                    key={index}
                    className="ao-file-card"
                    onClick={() => handleFileClick(file)}
                    onContextMenu={(e) => handleContextMenu(e, 'file', file)}
                  >
                    <div className="file-icon-container">
                      <div className="file-icon">
                        {file.type === 'pdf' && <FaFilePdf />}
                        {file.type === 'image' && <FaImage />}
                        {file.type === 'notebook' && <FaStickyNote />}
                      </div>
                      <button 
                        className={`file-action-btn ${importantFiles.some(f => f.name === file.name) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleImportant(file);
                        }}
                      >
                        <FaStar />
                      </button>
                    </div>
                    <div className="ao-file-name">{file.name}</div>
                  </div>
                ))}
                {filteredFiles().length === 0 && (
                  <div className="empty-state">
                    {searchTerm ? 'No files match your search' : 'No files in this folder'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
    {/* 1) CREATE NEW under this folder */}
{contextMenu.type === 'year' && (
  <button
    className="context-menu-item"
    onClick={() => {
      setCreatingType(`subject:${contextMenu.item._id}`);
      setContextMenu(null);
    }}
  >
    <FaPlus /> New Subject
  </button>
)}

    {contextMenu.type === 'subject' && (
      <button
        className="context-menu-item"
        onClick={() => {
          // we need both year and subject name to create a chapter:
          setCreatingType(`chapter:${selectedYear}:${contextMenu.item}`);
          setContextMenu(null);
        }}
      >
        <FaPlus /> New Chapter
      </button>
    )}
    {contextMenu.type === 'chapter' && (
      <button
        className="context-menu-item"
        onClick={() => {
          // for a chapter we’ll open the same “New” modal you use in the toolbar:
          setShowNewModal(true);
          setContextMenu(null);
        }}
      >
        <FaPlus /> New File / Note
      </button>
    )}
          <button   className="context-menu-item" onClick={()=>{
          setRenaming(contextMenu);
          setContextMenu(null);
          }}><FaEdit/>Rename</button>
          <button  className="context-menu-item" onClick={()=>{
          setMoving(contextMenu.item);
          setContextMenu(null);
          }}><FaArrowsAlt/>Move</button>
          
          <button 
            className="context-menu-item"
            onClick={() => {
              if (contextMenu.type === 'file') {
                handleToggleImportant(contextMenu.item);
              }
              setContextMenu(null);
            }}
          >
            <FaStar /> {importantFiles.some(f => f.name === contextMenu.item?.name) 
              ? 'Remove Important' : 'Mark Important'}
          </button>
          <button 
            className="context-menu-item delete"
            onClick={() => {
              setDeleteTarget({
                type: contextMenu.type,
                name: contextMenu.item
              });
              setContextMenu(null);
            }}
          >
            <FaTrash /> Delete
          </button>
        </div>
      )}
{renaming && (
  <RenamePrompt
    currentName={renaming.item.name || renaming.item}
    onRename={handleRename}
    onCancel={()=>setRenaming(null)}
  />
)}

{moving && (
  <MoveModal
    data={data}
    item={moving}
    onMove={handleMove}
    onClose={()=>setMoving(null)}
  />
)}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteItem(deleteTarget.type, deleteTarget.name)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicOrganizer;