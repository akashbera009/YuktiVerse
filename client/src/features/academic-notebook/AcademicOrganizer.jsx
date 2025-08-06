import React, { useState, useEffect, useRef , useMemo } from 'react';
import { FaFolder, FaFolderOpen, FaFilePdf, FaImage, FaStickyNote, FaPlus, FaStar, FaTrash, FaSearch, FaBars, FaTimes, FaEdit, FaArrowsAlt} from 'react-icons/fa';
import './AcademicOrganizer.css';
import NewModal from "./NewModal"
// import NotebookEditor from "./NotebookEditor"
import RenamePrompt from "./RenamePrompt"
// import MoveModal from "./MoveModal"
// import ContextMenu from './ContextMenu';
import Notebook from '../ai-notepad/Notebook';
// import ModernPDFViewer from '../ai-notepad/ModernPDFViewer';
import ModernPDFViewer from '../ai-notepad/MOdernPDFViewer';
import axios from 'axios';
import {DotsLoader,
  RingLoader,
  SquaresLoader,
  BarsLoader,
  OrbitLoader,
  ProgressLoader,
  HexagonLoader,
  OverlayLoader,
  InlineLoader,
  SmartLoader,
  useLoader,
  withLoading,
  LoaderShowcase} from '../../components/Loader';
import AiHelpers from '../ai-notepad/AiHelpers';

const STORAGE_KEY = 'academicOrganizerData';

const AcademicOrganizer = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [recentFiles, setRecentFiles] = useState([]);

  const [creatingType, setCreatingType] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); 

  const [showNewModal, setShowNewModal] = useState(false);
  
  const [moving, setMoving] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New states implemented 
  const [years, setYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [materials, setMaterials] = useState({ notebooks: [], handwrittenNotes: [] });
  const [selectedNotebook, setSelectedNotebook] = useState(null);

  const [viewerType, setViewerType] = useState(null);
  const [notebookContent, setNotebookContent] = useState(null);
 
  const [editingYearId, setEditingYearId] = useState(null); 
  const [editingSubjectId, setEditingSubjectId] = useState(null); 
  const [editingChapterId, setEditingChapterId] = useState(null); 
  const [showNotebookForm, setShowNotebookForm] = useState(false); 
  // const [notebookName, setNotebookName] = useState('');
  // const [textBoxes, setTextBoxes] = useState([]); 
  // const [isSaving, setIsSaving] = useState(false);

  const [chatActive , setChatActive] = useState(false)
  const panelRef = useRef(null);
  // ✅ Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setChatActive(false);
      }
    };

    if (chatActive) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [chatActive]);
    // at the top of your component
    const openInNotes = (file) => {
      handleFileClick(file);
      setActiveTab('notes');
    };

  const [allFiles, setAllFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get('/years');
        setYears(res.data);
      } catch (err) {
        console.error('Error fetching years:', err);
      }
    };
    fetchYears();
  }, []);

  // Fetch subjects when year is selected
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  useEffect(() => {
    if (selectedYearId) {
      const fetchSubjects = async () => {
        try {
          setSubjectsLoading(true);
          const res = await axios.get(`/years/${selectedYearId}/subjects`);
          setSubjects(res.data);
        } catch (err) {
          console.error('Error fetching subjects:', err);
        }finally {
        setSubjectsLoading(false);
      }
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedYearId]);

  // Fetch chapters when subject is selected
  const [chaptersLoading, setChaptersLoading] = useState(false);
  useEffect(() => {
    if (selectedSubjectId) {
      const fetchChapters = async () => {
        try {
           setChaptersLoading(true);
          const res = await axios.get(`/years/subjects/${selectedSubjectId}/chapters`);
          setChapters(res.data);
        } catch (err) {
          console.error('Error fetching chapters:', err);
        }finally {
          setChaptersLoading(false);
        }
      };
      fetchChapters();
    } else {
      setChapters([]);
    }
  }, [selectedSubjectId]);

  // Fetch materials when chapter is selected
  useEffect(() => {
    if (selectedChapterId) {
      setLoading(true);
      // setChaptersLoading(true);
      setError(null);
      axios.get(`/years/${selectedChapterId}/materials`)
        .then(res => setMaterials(res.data))
        .catch(err => {
          console.error('Error fetching materials:', err);
          setError("Failed to load materials");
        })
        .finally(() => setLoading(true));
    }
  }, [selectedChapterId]);

  const handleYearClick = (yearId) => {
    const yearData = years.find(y => y._id === yearId);
    if (selectedYearId === yearId) {
      setSelectedYearId(null);
      setSelectedYear(null);
      setSubjects([]);
      setChapters([]);
      setMaterials({ notebooks: [], handwrittenNotes: [] });
    } else {
      setSelectedYearId(yearId);
      setSelectedYear(yearData?.title);
      setSubjects([]);
      setChapters([]);
      setMaterials({ notebooks: [], handwrittenNotes: [] });
    }
  };

  const handleSubjectClick = (subjectId) => {
    const subjectData = subjects.find(s => s._id === subjectId);
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
      setSelectedSubject(null);
    } else {
      setSelectedSubjectId(subjectId);
      setSelectedSubject(subjectData?.name);
    }

    // Clear dependent states
    setChapters([]);
    setMaterials({ notebooks: [], handwrittenNotes: [] });
    setSelectedChapterId(null);
    setSelectedNotebook(null);
  };

  const handleChapterClick = (chapterId) => {
    const chapterData = chapters.find(c => c._id === chapterId);
    if (selectedChapterId === chapterId) {
      setSelectedChapterId(null);
      setSelectedChapter(null);
    } else {
      setSelectedChapterId(chapterId);
      setSelectedChapter(chapterData?.title);
    }

    // Clear previous materials + notebook
    setMaterials({ notebooks: [], handwrittenNotes: [] });
    setSelectedNotebook(null);
  };

  const [fileLoading, setFileLoading] = useState(false);
  const handleFileClick = async (file) => {
    setSelectedFile(file);
    setViewerType(null); // reset before loading new
    setFileLoading(true);
    // Track as a recent file
    setRecentFiles(prev => [
      { ...file, timestamp: new Date() },
      ...prev.filter(f => f._id !== file._id).slice(0, 4)
    ]);
    
    if (file.type === 'notebook') {
      try {
        const res = await axios.get(`/api/notebooks/${file.note_id}`);
        setNotebookContent(res.data);
        // setFileLoading(false);
        setViewerType('notebook');
      } catch (err) {
        console.error('Error loading notebook:', err);
      }
       finally {
        // setFileLoading(false);
      }
    } else if (file.type === 'handwritten') {
      setViewerType('pdf'); // we'll use file.fileUrl to view this
    } else {
      console.warn('Unknown file type');
    }
  };

  // Handle closing file view
  const handleCloseFile = () => {
    setSelectedFile(null);
    setFileLoading(null)
  };

  const handleCreateYear = async (title) => {
    try {
      const res = await axios.post('/years', { title, important: false });
      setYears(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Error creating year:', err);
      alert('Failed to create year');
    }
  };

  const handleToggleImportantYear = async (yearId) => {
    try {
      const year = years.find(y => y._id === yearId);
      if (!year) return;

      const updated = await axios.patch(`/years/${yearId}`, {
        important: !year.important,
      });

      setYears(prev =>
        prev.map(y => y._id === yearId ? { ...y, important: updated.data.important } : y)
      );
    } catch (err) {
      console.error("Failed to toggle year importance:", err);
      alert("Failed to update year");
    }
  }

  const renameYear = async (yearId, newTitle) => {
    try {
      console.log(yearId, newTitle);
      
      await axios.patch(`/years/rename/${yearId}`, { title: newTitle });
      setYears(prev => prev.map(y => y._id === yearId ? { ...y, title: newTitle } : y));
      setEditingYearId(null);
    } catch (err) {
      console.error("Rename year failed", err);
    }
  };

  // Delete function for the folders only 
  const handleDeleteItem = async (type, id) => {
    // if (!window.confirm("Are you sure you want to delete this item and all its contents?")) return;
    setDeleteTarget(true);
    try {
      if (type === 'year') {
        await axios.delete(`/years/${id}`);
        setYears(prev => prev.filter(y => y._id !== id));

        if (selectedYearId === id) {
          setSelectedYearId(null);
          setSubjects([]);
          setSelectedSubjectId(null);
          setChapters([]);
          setSelectedChapterId(null);
          setMaterials({ notebooks: [], handwrittenNotes: [] });
        }
      }
      else if (type === 'subject') {
        await axios.delete(`/years/subjects/${id}`);
        setSubjects(prev => prev.filter(s => s._id !== id));

        if (selectedSubjectId === id) {
          setSelectedSubjectId(null);
          setChapters([]);
          setSelectedChapterId(null);
          setMaterials({ notebooks: [], handwrittenNotes: [] });
        }
      }
      else if (type === 'chapter') {
        await axios.delete(`/years/subjects/chapters/${id}`);
        setChapters(prev => prev.filter(c => c._id !== id));

        if (selectedChapterId === id) {
          setSelectedChapterId(null);
          setMaterials({ notebooks: [], handwrittenNotes: [] });
        }
      }
      
    } catch (err) {
      alert("Deletion failed.");
      console.error(err);
    }
  }

  // For the notebook and written notes 
  const handleDeleteFile = async (file, type) => {
    // if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      if (type === 'notebook') {
        await axios.delete(`/api/notebooks/${file._id}`);
        setMaterials(prev => ({
          ...prev,
          notebooks: prev.notebooks.filter(n => n._id !== file._id)
        }));

        if (selectedFile?.type === 'notebook' && selectedFile.fileUrl === file.note_id) {
          handleCloseFile(); // optional: clear preview if open
        }
      } else if (type === 'handwritten') {
        await axios.delete(`/api/handwritten-notes/${file._id}`);
        setMaterials(prev => ({
          ...prev,
          handwrittenNotes: prev.handwrittenNotes.filter(n => n._id !== file._id)
        }));

        if (selectedFile?.type === 'handwritten' && selectedFile.name === file.title) {
          handleCloseFile();
        }
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
      alert("Could not delete the file.");
    }
  };

  const handleCreateSubject = async (name) => {
    if (!selectedYearId) {
      alert('Please select a year first.');
      return;
    }
    
    try {
      const res = await axios.post(`/years/${selectedYearId}/subjects`, {
        name,
        important: false,
      });
      
      setSubjects(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Error creating subject:', err);
      alert('Failed to create subject');
    }
  };

  const handleToggleImportantSubject = async (subjectId) => {
    try {
      const subject = subjects.find(s => s._id === subjectId);
      if (!subject) return;

      const updated = await axios.patch(`years/subjects/${subjectId}`, {
        important: !subject.important,
      });

      setSubjects(prev =>
        prev.map(s => s._id === subjectId ? { ...s, important: updated.data.important } : s)
      );
    } catch (err) {
      console.error("Failed to toggle subject importance:", err);
      alert("Failed to update subject");
    }
  };

  const renameSubject = async (subjectId, newName) => {
    try {
      const subject = subjects.find(s => s._id === subjectId);
      if (!subject) return;

      await axios.patch(`/years/subjects/rename/${subjectId}`, { name: newName });
      setSubjects(prev => 
        prev.map(s => s._id === subjectId ? { ...s, name: newName } : s));
      setEditingSubjectId(null);
    } catch (err) {
      console.error("Rename subject failed", err);
    }
  }

  const handleCreateChapter = async (chapterTitle) => {
    if (!selectedSubjectId) {
      alert("Please select a subject first.");
      return;
    }
    
    try {
      const res = await axios.post(
        `/years/subjects/${selectedSubjectId}/chapters`,
        { chapterTitle } // ✅ correct key
      );
      
      // Update local state — assuming chapters come directly
      setChapters(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error creating chapter:", err);
      alert("Failed to create chapter");
    }
  };

  const handleToggleImportantChapter = async (chapterId) => {
    try {
      const chapter = chapters.find(ch => ch._id === chapterId);
      if (!chapter) return;
      console.log(chapter);
      
      const updated = await axios.patch(`years/subjects/chapters/${chapterId}`, {
        important: !chapter.important,
      });

      setChapters(prev =>
        prev.map(ch => ch._id === chapterId ? { ...ch, important: updated.data.important } : ch)
      );
    } catch (err) {
      console.error("Failed to toggle chapter importance:", err);
    }
  };

  const renameChapter = async (chapterId, newTitle) => {
    try {
      await axios.patch(`years/subjects/chapters/rename/${chapterId}`, { title: newTitle });
      setChapters(prev => prev.map(c => c._id === chapterId ? { ...c, title: newTitle } : c));
      setEditingChapterId(null);
    } catch (err) {
      console.error("Rename chapter failed", err);
    }
  };

  // const createNotebook = async () => {
  //   try {
  //     setIsSaving(true);
      
  //     const payload = {
  //       name: notebookName,
  //       chapter: selectedChapterId, 
  //       content: {
  //         textBoxes: textBoxes
  //       }
  //     };
      
  //     const response = await axios.post('/api/notebooks/', payload);
  //     console.log('Notebook created:', response.data);
  //     setMaterials(prev => ({
  //       ...prev,
  //       notebooks: [...(prev.notebooks || []), response.data]
  //     }));
      
  //     setNotebookName('');
  //     setTextBoxes([]);
  //     setShowNotebookForm(false);
      
  //   } catch (err) {
  //     console.error('Failed to create notebook:', err);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // const viewNotebookById = async (noteId) => {
  //   try {
  //     const res = await axios.get(`/api/notebooks/${noteId}`);
  //     setSelectedNotebook(res.data);
  //     console.log('viewing notebook:', res.data);
  //   } catch (err) {
  //     console.error('Failed to fetch notebook:', err);
  //   }
  // };

  // Rename notebook
  const renameNotebook = async (noteId, newName) => {
    await axios.patch(`/api/notebooks/${noteId}/rename`, { name: newName });
  };

  // Toggle important notebook
  const toggleImportantNotebook = async (noteId) => {
    await axios.patch(`/api/notebooks/${noteId}/important`);
  };

  // Rename scanned note
  const renameScannedNote = async (noteId, newTitle) => {
    await axios.patch(`/api/handwritten-notes/${noteId}/rename`, { title: newTitle });
  };

  // Toggle important scanned note
  const toggleImportantScannedNote = async (noteId) => {
    await axios.patch(`/api/handwritten-notes/${noteId}/important`);
  };

  const handleRename = async (file, type, newName) => {
    try {
      if (type === 'notebook') {
        await renameNotebook(file._id, newName);
        setMaterials(prev => ({
          ...prev,
          notebooks: prev.notebooks.map(n =>
            n._id === file._id ? { ...n, name: newName } : n
          )
        }));
      } else {
        await renameScannedNote(file._id, newName);
        setMaterials(prev => ({
          ...prev,
          handwrittenNotes: prev.handwrittenNotes.map(n =>
            n._id === file._id ? { ...n, title: newName } : n
          )
        }));
      }
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename");
    }
  };


  // This toggle works for only the notebook and handwrittenNotes
  const handleToggleImportant = async (file, type) => {
    try {
      if (type === 'notebook') {
        await toggleImportantNotebook(file._id);
        setMaterials(prev => ({
          ...prev,
          notebooks: prev.notebooks.map(n =>
            n._id === file._id ? { ...n, important: !n.important } : n
          )
        }));

      } else {
        await toggleImportantScannedNote(file._id);
        setMaterials(prev => ({
          ...prev,
          handwrittenNotes: prev.handwrittenNotes.map(n =>
            n._id === file._id ? { ...n, important: !n.important } : n
          )
        }));
      }
      setAllFiles(prev =>
        prev.map(f =>
          f._id === file._id
            ? { ...f, important: !f.important }
            : f
        )
      );

    } catch (err) {
      console.error("Failed to toggle important:", err);
      alert("Could not update importance");
    }
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
  // const getFullPath = () => {
  //   const path = [];
  //   if (selectedYear) path.push(selectedYear);
  //   if (selectedSubject) path.push(selectedSubject);
  //   if (selectedChapter) path.push(selectedChapter);
  //   if (selectedFile) path.push(selectedFile.name);
  //   return path.join(' > ');
  // };
const getSteps = () => {
  const steps = [];
  if (selectedYear) steps.push({ label: selectedYear });
  if (selectedSubject) steps.push({ label: selectedSubject });
  if (selectedChapter) steps.push({ label: selectedChapter});
  if (selectedFile) {
    steps.push({ label: selectedFile.name }); // current step
  }
  return steps;
};

  // Get all important files from materials
  // const getAllImportantFiles = () => {
  //   const importantNotebooks = materials.notebooks?.filter(n => n.important) || [];
  //   const importantHandwritten = materials.handwrittenNotes?.filter(n => n.important) || [];
  //   return [...importantNotebooks, ...importantHandwritten];
  // };
// const getAllImportantFiles = () => {
//   const importantNotebooks = (materials.notebooks || [])
//     .filter(n => n.important)
//     .map(n => ({ ...n, type: 'notebook', name: n.name }));
//   const importantHandwritten = (materials.handwrittenNotes || [])
//     .filter(h => h.important)
//     .map(h => ({ ...h, type: 'handwritten', name: h.title }));
//   return [...importantNotebooks, ...importantHandwritten];
// };

const [isFetchingAllFiles, setIsFetchingAllFiles] = useState(false);
const [allFilesFetched, setAllFilesFetched] = useState(false);
const [fetchAllFilesError, setFetchAllFilesError] = useState(null);

const fetchAllFiles = async () => {
  if (allFilesFetched) return;
  setIsFetchingAllFiles(true);
  setFetchAllFilesError(null);
  setFilesLoading(true);
  try {
    const allFilesData = [];
    
    const yearsRes = await axios.get('/years');
    const years = yearsRes.data;

    for (const year of years) {
      const subjectsRes = await axios.get(`/years/${year._id}/subjects`);
      const subjects = subjectsRes.data;
      
      for (const subject of subjects) { 
        const chaptersRes = await axios.get(`/years/subjects/${subject._id}/chapters`);
        const chapters = chaptersRes.data;
         
        for (const chapter of chapters) {
          try { 
            const materialsRes = await axios.get(`/years/${chapter._id}/materials`);
            const materials = materialsRes.data;
             
            if (materials.notebooks) {
              materials.notebooks.forEach(notebook => {
                allFilesData.push({
                  ...notebook,
                  type: 'notebook',
                  yearId: year._id,
                  yearTitle: year.title,
                  subjectId: subject._id,
                  subjectName: subject.name,
                  chapterId: chapter._id,
                  chapterTitle: chapter.title,
                  fullPath: `${year.title} / ${subject.name} / ${chapter.title}`,
                  searchableText: notebook.name.toLowerCase() // for easier searching
                });
              });
            }
             
            if (materials.handwrittenNotes) {
              materials.handwrittenNotes.forEach(note => {
                allFilesData.push({
                  ...note,
                  type: 'handwritten',
                  yearId: year._id,
                  yearTitle: year.title,
                  subjectId: subject._id,
                  subjectName: subject.name,
                  chapterId: chapter._id,
                  chapterTitle: chapter.title,
                  fullPath: `${year.title} / ${subject.name} / ${chapter.title}`,
                  searchableText: note.title.toLowerCase() // for easier searching
                });
              });
            }
          } catch (chapterErr) {
            console.warn(`Failed to fetch materials for chapter ${chapter.title}:`, chapterErr); 
          }
        }
      }
    }
    
    console.log(`Loaded ${allFilesData.length} files for search`);
    setAllFiles(allFilesData);
    setAllFilesFetched(true);
  } catch (err) {
    console.error('Error fetching all files:', err);
    setFetchAllFilesError('Failed to fetch all files.');
  } finally {
    setFilesLoading(false);
    setIsFetchingAllFiles(false);
  }
};
useEffect(() => {
  if (showSearchResults && searchTerm.trim() !== '' && !allFilesFetched && !isFetchingAllFiles) {
    fetchAllFiles();
  }
}, [showSearchResults, searchTerm, allFilesFetched, isFetchingAllFiles]);


const [yearsLoading, setYearsLoading] = useState(true);
useEffect(() => {
  const fetchYears = async () => {
    try {
      setYearsLoading(true);
      const res = await axios.get('/years');
      setYears(res.data);
      
      // After years are loaded, fetch all files for search
      fetchAllFiles();
      
    } catch (err) {
      console.error('Error fetching years:', err);
    }finally {
      setYearsLoading(false);
    }
  };
  fetchYears();
}, []);
const updateAllFilesCache = (chapterId, updatedMaterials, yearTitle, subjectName, chapterTitle, yearId, subjectId) => {
  setAllFiles(prevFiles => {
    prevFiles.map(f =>
      f._id === f._id ? { ...f, important: !f.important } : f
    )
    // Re old files from this chapter
    const filteredFiles = prevFiles.filter(file => file.chapterId !== chapterId);
    
    // Add updated files
    const newFiles = [];
    
    // Add notebooks
    if (updatedMaterials.notebooks) {
      updatedMaterials.notebooks.forEach(notebook => {
        newFiles.push({
          ...notebook,
          type: 'notebook',
          yearId,
          yearTitle,
          subjectId,
          subjectName,
          chapterId,
          chapterTitle,
          fullPath: `${yearTitle} / ${subjectName} / ${chapterTitle}`,
          searchableText: notebook.name.toLowerCase()
        });
      });
    }
    
    // Add handwritten notes
    if (updatedMaterials.handwrittenNotes) {
      updatedMaterials.handwrittenNotes.forEach(note => {
        newFiles.push({
          ...note,
          type: 'handwritten',
          yearId,
          yearTitle,
          subjectId,
          subjectName,
          chapterId,
          chapterTitle,
          fullPath: `${yearTitle} / ${subjectName} / ${chapterTitle}`,
          searchableText: note.title.toLowerCase()
        });
      });
    }
    
    return [...filteredFiles, ...newFiles];
  });
};

// Update the existing materials fetch effect to also update the cache
useEffect(() => {
  if (selectedChapterId) {
    // setLoading(true);
    setFileLoading(true) ; 
    // setFileLoading(false)
    setError(null);
    axios.get(`/years/${selectedChapterId}/materials`)
      .then(res => {
        setMaterials(res.data);
        
        // Update the all files cache
        const yearTitle = years.find(y => y._id === selectedYearId)?.title || '';
        const subjectName = subjects.find(s => s._id === selectedSubjectId)?.name || '';
        const chapterTitle = chapters.find(c => c._id === selectedChapterId)?.title || '';
        
        updateAllFilesCache(
          selectedChapterId, 
          res.data, 
          yearTitle, 
          subjectName, 
          chapterTitle,
          selectedYearId,
          selectedSubjectId
        );
      })
      .catch(err => {
        console.error('Error fetching materials:', err);
        setError("Failed to load materials");
      })
      .finally(() => {
        // setLoading(false) ;  
         setFileLoading(false)
        });
  }
}, [selectedChapterId, selectedYearId, selectedSubjectId, years, subjects, chapters]);

// Updated search function that uses allFiles
const searchAllFiles = (searchTerm) => {
  if (!searchTerm.trim()) return [];
  
  const term = searchTerm.toLowerCase();
  return allFiles.filter(file => 
    file.searchableText.includes(term) || 
    file.fullPath.toLowerCase().includes(term)
  );
};
  // Get all files for search
  const getAllFiles = () => {
    const notebooks = materials.notebooks?.map(n => ({ ...n, type: 'notebook' })) || [];
    const handwritten = materials.handwrittenNotes?.map(n => ({ ...n, type: 'handwritten' })) || [];
    return [...notebooks, ...handwritten];
  };

  // Filter files based on search
  const filteredFiles = () => {
    const allFiles = getAllFiles();
    if (!searchTerm) {
      const notebooks = materials.notebooks?.map(n => ({ ...n, type: 'notebook' })) || [];
      const handwritten = materials.handwrittenNotes?.map(n => ({ ...n, type: 'handwritten' })) || [];
      return [...notebooks, ...handwritten];
    }
  return searchAllFiles(searchTerm);
  };
  const loadChapterAndOpenFile = async (file) => {
  try {
    // If we're not in the right chapter context, navigate there first
    if (selectedChapterId !== file.chapterId) {
      // Set the hierarchy
      setSelectedYearId(file.yearId);
      setSelectedYear(file.yearTitle);
      setSelectedSubjectId(file.subjectId);
      setSelectedSubject(file.subjectName);
      setSelectedChapterId(file.chapterId);
      setSelectedChapter(file.chapterTitle);
      
      // Wait a bit for the materials to load, then open the file
      setTimeout(() => {
        handleFileClick(file);
      }, 300);
    } else {
      // Already in the right context, just open the file
      handleFileClick(file);
    }
  } catch (err) {
    console.error('Failed to navigate to file:', err);
  }
};

// Functions to update cache when files are created/deleted/renamed
const addFileToCache = (newFile, type) => {
  const yearTitle = years.find(y => y._id === selectedYearId)?.title || '';
  const subjectName = subjects.find(s => s._id === selectedSubjectId)?.name || '';
  const chapterTitle = chapters.find(c => c._id === selectedChapterId)?.title || '';
  
  const fileWithContext = {
    ...newFile,
    type,
    yearId: selectedYearId,
    yearTitle,
    subjectId: selectedSubjectId,
    subjectName,
    chapterId: selectedChapterId,
    chapterTitle,
    fullPath: `${yearTitle} / ${subjectName} / ${chapterTitle}`,
    searchableText: (type === 'notebook' ? newFile.name : newFile.title).toLowerCase()
  };
  
  setAllFiles(prev => [...prev, fileWithContext]);
};

const removeFileFromCache = (fileId) => {
  setAllFiles(prev => prev.filter(file => file._id !== fileId));
};

const updateFileInCache = (fileId, updates) => {
  setAllFiles(prev => prev.map(file => {
    if (file._id === fileId) {
      const updatedFile = { ...file, ...updates };
      // Update searchable text if name/title changed
      if (updates.name || updates.title) {
        updatedFile.searchableText = (updates.name || updates.title).toLowerCase();
      }
      return updatedFile;
    }
    return file;
  }));
};


// console.log(selectedFile);



  // Upload purpose
  const handleUploadFile = (file, type) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileObj = { type, name: file.name, dataUrl: reader.result };
      // Handle upload logic here
      setShowNewModal(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle saving notebook
  const handleSaveNotebook = async (notebookData) => {
    try {
      // Save notebook logic hereb
      console.log('Saving notebook:', notebookData);
    } catch (err) {
      console.error('Failed to save notebook:', err);
    }
  };

    const tabsRef = useRef(null);
  const sliderRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});

  const tabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'recent', label: 'Recent' },
    { id: 'important', label: 'Important' }
  ];

  // Update slider position when active tab changes
  useEffect(() => {
    if (tabsRef.current && sliderRef.current) {
      const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
      const activeTabElement = tabsRef.current.children[activeTabIndex + 1]; // +1 because slider is first child
      
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        setSliderStyle({
          transform: `translateX(${offsetLeft}px)`,
          width: `${offsetWidth}px`
        });
      }
    }
  }, [activeTab]);

  // Initialize slider position on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tabsRef.current) {
        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
        const activeTabElement = tabsRef.current.children[activeTabIndex + 1];
        
        if (activeTabElement) {
          const { offsetLeft, offsetWidth } = activeTabElement;
          setSliderStyle({
            transform: `translateX(${offsetLeft}px)`,
            width: `${offsetWidth}px`
          });
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  return (
    <div className={`ao-container ${sidebarOpen ? '' : 'collapsed'}`} onClick={handleCloseContextMenu}>
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-left">
          <button className="nav-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          <div className="app-name">YuktiVerse</div>
        </div>
        
 <div className="tabs-sliding" ref={tabsRef}>
        {/* Animated Background Slider */}
        <div 
          className="tab-slider" 
          ref={sliderRef}
          style={sliderStyle}
        />
        
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-sliding ${activeTab === id ? 'active' : ''}`}
            onClick={() => handleTabClick(id)}
            onMouseDown={(e) => {
              if (e.currentTarget) {
                e.currentTarget.style.transform = 'translate3d(0, 1px, 0) scale(0.98)';
              }
            }}
            onMouseUp={(e) => {
              setTimeout(() => {
                if (e.currentTarget) {
                  e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1)';
                }
              }, 100);
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget) {
                e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1)';
              }
            }}

          >
            <span className="tab-text">{label}</span>
          </button>
        ))}
      </div>
        
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

        {/* chatbot */}
     <>
      <button
        className="chatbot-icon-button"
        onClick={() => setChatActive(prev => !prev)} // ✅ Fix: toggle state correctly
        aria-label="Open YuktiVerse Chat"
      >
        <div className="chatbot-icon-ripple" />
        <div className="chatbot-glow" />
        <div className="chatbot-icon-container">
         <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="white"
          className="chatbot-icon"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-4.724l-4.762 2.857a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2h-1a4 4 0 0 1 -3.995 -3.8l-.005 -.2v-8a4 4 0 0 1 4 -4zm-2.8 9.286a1 1 0 0 0 -1.414 .014a2.5 2.5 0 0 1 -3.572 0a1 1 0 0 0 -1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0 -.014 -1.414m-5.69 -4.286h-.01a1 1 0 1 0 0 2h.01a1 1 0 0 0 0 -2m5 0h-.01a1 1 0 0 0 0 2h.01a1 1 0 0 0 0 -2" />
        </svg>
        </div>
      </button>

      {chatActive && (
        <div ref={panelRef}>
          <AiHelpers
            text="Hi"
            onClose={() => setChatActive(false)} // ✅ Pass close handler
            mode= "chatbot"
          />
        </div>
      )}
    </>
          {showSearchResults && searchTerm.trim() !== '' && (
            <div className="global-search-results">
              {isFetchingAllFiles ? (
                // <div className="loader">Fetching all files...</div>
                <SquaresLoader/>

              ) : fetchAllFilesError ? (
                <div className="error">{fetchAllFilesError}</div>
              ) : (
                <>
                  {searchAllFiles(searchTerm).map((file, index) => (
                    <div
                      key={`${file._id}-${index}`}
                      className="search-result-item"
                      onClick={() => {
                        loadChapterAndOpenFile(file);
                        setSearchTerm('');
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="search-result-icon">
                        {file.type === 'notebook' && <FaStickyNote />}
                        {file.type === 'handwritten' && <FaFilePdf />}
                      </div>
                      <div className="search-result-name">
                        {file.type === 'notebook' ? file.name : file.title}
                      </div>
                      <div className="search-result-path">
                        {file.fullPath}
                      </div>
                    </div>
                  ))}
                  {searchAllFiles(searchTerm).length === 0 && (
                    <div className="no-results">No matching files found.</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`ao-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
        {yearsLoading ? (
          // <SmartLoader context="card" text="" />
          <OrbitLoader/>
          // <SquaresLoader/>
           ) : (
          years.map(year => (
            <div key={year._id} className="ao-section">
              <button
                className={`ao-button ${selectedYearId === year._id ? 'active' : ''}`}
                onClick={() => handleYearClick(year._id)}
                onContextMenu={(e) => handleContextMenu(e, 'year', year)}
              >
                {selectedYearId === year._id ? (
                  <FaFolderOpen className="ao-icon" />
                ) : (
                  <FaFolder className="ao-icon" />
                )}
                {year.title}
                {year.important && <FaStar className="important-star" />}
              </button>
              
              {selectedYearId === year._id && (
                <div className="ao-subsection">
                  {subjectsLoading ? (
                    <div style={{ padding: '10px', marginLeft: '20px' }}>
                      <InlineLoader type="dots" text="" />
                    </div>
                  ) : (subjects.map(subject => (
                                  <div key={subject._id} className="ao-subitem">
                      <button
                        className={`ao-button ao-subbutton ${selectedSubjectId === subject._id ? 'active' : ''}`}
                        onClick={() => handleSubjectClick(subject._id)}
                        onContextMenu={(e) => handleContextMenu(e, 'subject', subject)}
                      >
                        {selectedSubjectId === subject._id ? (
                          <FaFolderOpen className="ao-icon" />
                        ) : (
                          <FaFolder className="ao-icon" />
                        )}
                        {subject.name}
                        {subject.important && <FaStar className="important-star" />}
                      </button>
                      
                      {selectedSubjectId === subject._id && (
                        <div className="ao-subsection">
                          {chaptersLoading ? (
                            <div style={{ padding: '8px', marginLeft: '40px' }}>
                               <InlineLoader type="dots" text="" />
                            </div>
                          ) : (
                            chapters.map(chapter => (
                            <div key={chapter._id} className="ao-subitem">
                              <button
                                className={`ao-button ao-subbutton ${selectedChapterId === chapter._id ? 'active' : ''}`}
                                onClick={() => handleChapterClick(chapter._id)}
                                onContextMenu={(e) => handleContextMenu(e, 'chapter', chapter)}
                              >
                                {selectedChapterId === chapter._id ? (
                                  <FaFolderOpen className="ao-icon" />
                                ) : (
                                  <FaFolder className="ao-icon" />
                                )}
                                {chapter.title}
                                {chapter.important && <FaStar className="important-star" />}
                              </button>
                            </div>
                          )))
                          }
                          
                          {/* Create Chapter Button */}
                          <div className="ao-create-section">
                            {creatingType === `chapter:${selectedSubjectId}` ? (
                              <div className="ao-create-input">
                                <input
                                  value={newItemName}
                                  onChange={e => setNewItemName(e.target.value)}
                                  onKeyDown={async e => {
                                    if (e.key === 'Enter' && newItemName.trim()) {
                                      await handleCreateChapter(newItemName.trim());
                                      setNewItemName('');
                                      setCreatingType(null);
                                    }
                                    if (e.key === 'Escape') setCreatingType(null);
                                  }}
                                  placeholder="Enter chapter title"
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <button
                                className="ao-create-button"
                                onClick={() => {
                                  setCreatingType(`chapter:${selectedSubjectId}`);
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
                  )))}
                  
                  {/* Create Subject Button */}
                  <div className="ao-create-section">
                    {creatingType === `subject:${selectedYearId}` ? (
                      <div className="ao-create-input">
                        <input
                          value={newItemName}
                          onChange={e => setNewItemName(e.target.value)}
                          onKeyDown={async e => {
                            if (e.key === 'Enter' && newItemName.trim()) {
                              await handleCreateSubject(newItemName.trim());
                              setNewItemName('');
                              setCreatingType(null);
                            }
                            if (e.key === 'Escape') setCreatingType(null);
                          }}
                          placeholder="Enter subject name"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        className="ao-create-button ao-subbutton"
                        onClick={() => {
                          setCreatingType(`subject:${selectedYearId}`);
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
          )
         )
         )}
          
          {/* Create Year Button */}
          <div className="ao-create-section">
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
        <div className="breadcrumb-stepper">
          {getSteps().map((step, index, arr) => (
            <div
              key={index}
              className={`breadcrumb-step ${step.completed ? "completed" : "current"} ${index === arr.length - 1 ? "last" : ""}`}
            >
              <span className="label">{step.label}</span>
            </div>
          ))}
        </div>
          
          <div className="actions">
            <button className="action-btn" onClick={() => setShowNewModal(true)}>
              <FaPlus /> New
            </button>
            {showNewModal && (
              <NewModal
                onClose={() => setShowNewModal(false)}
                onUploadFile={handleUploadFile}
                onCreateNotebook={() => {
                  setShowNotebookForm(true);
                  setShowNewModal(false);
                }}
                selectedChapterId = {selectedChapterId}
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
                  onClick={() => openInNotes(file)}
                >
                  <div className="file-icon">
                    {file.type === 'notebook' && <FaStickyNote />}
                    {file.type === 'handwritten' && <FaFilePdf />}
                    {file.type === 'pdf' && <FaFilePdf />}
                    {file.type === 'image' && <FaImage />}
                  </div>
                  <div className="file-info">
                    <div className="file-name">
                      {file.type === 'notebook' ? file.name : file.title || file.name}
                    </div>
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
        {allFiles
          .filter(f => f.important)
          .map(file => (
            <div
              key={file._id}
              className="ao-file-card"
              onClick={() => openInNotes(file)}
            >
              <div className="file-icon-container">
                <div className="file-icon">
                  {file.type === 'notebook'     ? <FaStickyNote />
                  : file.type === 'handwritten' ? <FaFilePdf />
                  : null}
                </div>
                <button
                  className="file-action-btn active"
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleImportant(file);
                  }}
                >
                  <FaStar />
                </button>
              </div>
              <div className="ao-file-name">{file.name}</div>
            </div>
          ))
        }

        {allFiles.filter(f => f.important).length === 0 && (
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
              <button className="close-btn" onClick={handleCloseFile}>
                <FaTimes />
              </button>
            </div>
            <div className="file-content">
              {selectedFile.type === 'handwritten' ? (
                <div className="pdf-preview">

                  {selectedFile.fileUrl && (
                    <ModernPDFViewer fileUrl= {selectedFile.fileUrl} fileName = {selectedFile.title} type='handwritten' />
                  )}
                </div>
              ) : selectedFile.type === 'image' ? (
                <div className="image-preview">
                  <div className="placeholder-image" />
                </div>
              ) : selectedFile.type === 'notebook' ? (
                <div className="notebook-preview">
                  <Notebook 
                    notebookId={selectedFile.note_id} 
                    notebookName={selectedFile.name}
                    onSave={handleSaveNotebook}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : activeTab === 'notes' && (
          <div className="content-area">
            <div className="files-section">
              <div className="section-header">
                {/* <h3>{selectedChapter || 'Files'}</h3> */}
                <span className='total-files'>{getAllFiles().length} items</span>
              </div>
                <div className="files-content-wrapper">
                {fileLoading && (
                  <div className="fileloader-overlay">
                    {/* <SmartLoader context="page" text="Loading file..." /> */}
                    <SquaresLoader/>
                  </div>
                )}
              {error && <div className="error">{error}</div>}
            {/* {getAllFiles().length === 0 && !fileLoading && (
              <div className="empty-state">
                {searchTerm ? 'No files match your search' : 'No files in this folder'}
              </div>
            ) } */}
              <div className="ao-files-grid">
                {/* Render Notebooks */}
                {materials.notebooks?.map((notebook) => (
                  <div
                    key={notebook._id}
                    className="ao-file-card"
                    onClick={() => handleFileClick({ 
                      ...notebook, 
                      type: 'notebook',
                      note_id: notebook._id 
                    })}
                    onContextMenu={(e) => handleContextMenu(e, 'file', { ...notebook, type: 'notebook' })}
                  >
                    <div className="file-icon-container">
                      <div className="file-icon">
                        <FaStickyNote />
                      </div>
                      <button 
                        className={`file-action-btn ${notebook.important ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleImportant(notebook, 'notebook');
                        }}
                      >
                        <FaStar />
                      </button>
                    </div>
                    <div className="ao-file-name">{notebook.name}</div>
                  </div>
                ))}
                
                {/* Render Handwritten Notes */}
                {materials.handwrittenNotes?.map((note) => (
                  <div
                    key={note._id}
                    className="ao-file-card"
                    onClick={() => handleFileClick({ 
                      ...note, 
                      type: 'handwritten' ,
                      fileType: note.fileType
                    })}
                    onContextMenu={(e) => handleContextMenu(e, 'file', { ...note, type: 'handwritten' })}
                  >
                    <div className="file-icon-container">
                      <div className="file-icon">
                        {/* <FaFilePdf /> */}
                        {note.fileType === 'pdf'
                          ? <FaFilePdf />
                          : <FaImage />
                        }
                      </div>
                      <button 
                        className={`file-action-btn ${note.important ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleImportant(note, 'handwritten');
                        }}
                      >
                        <FaStar />
                      </button>
                    </div>
                    <div className="ao-file-name">{note.title}</div>
                  </div>
                ))}
                
                {getAllFiles().length === 0 && !loading && (
                  <div className="empty-state">
                    {searchTerm ? 'No files match your search' : 'No files in this folder'}
                  </div>
                )}
              </div>
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
          {/* CREATE NEW under this folder */}
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
                setCreatingType(`chapter:${contextMenu.item._id}`);
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
                setShowNewModal(true);
                setContextMenu(null);
              }}
            >
              <FaPlus /> New File / Note
            </button>
          )}

          <button 
            className="context-menu-item" 
            onClick={() => {
              setRenaming(contextMenu);
              setContextMenu(null);
            }}
          >
            <FaEdit /> Rename
          </button>

          {/* <button 
            className="context-menu-item" 
            onClick={() => {
              setMoving(contextMenu.item);
              setContextMenu(null);
            }}
          >
            <FaArrowsAlt /> Move
          </button> */}
          
          <button 
            className="context-menu-item"
            onClick={() => {
              if (contextMenu.type === 'file') {
                handleToggleImportant(contextMenu.item, contextMenu.item.type);
              } else if (contextMenu.type === 'year') {
                handleToggleImportantYear(contextMenu.item._id);
              } else if (contextMenu.type === 'subject') {
                handleToggleImportantSubject(contextMenu.item._id);
              } else if (contextMenu.type === 'chapter') {
                handleToggleImportantChapter(contextMenu.item._id);
              }
              setContextMenu(null);
            }}
          >
            {contextMenu.item.important  == false ? 
             (<><FaStar /> Mark Important</>) :(
              <><svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-star-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3l18 18" /><path d="M10.012 6.016l1.981 -4.014l3.086 6.253l6.9 1l-4.421 4.304m.012 4.01l.588 3.426l-6.158 -3.245l-6.172 3.245l1.179 -6.873l-5 -4.867l6.327 -.917" /></svg> Unmark Important</>
             )
            }
           
          </button>

         <button
            className="context-menu-item delete"
            onClick={() => {
              if (contextMenu.type === 'file') {
                setDeleteTarget({
                  mode: 'file',
                  file: contextMenu.item,
                  fileType: contextMenu.item.type,
                  name: contextMenu.item.name || contextMenu.item.title
                });
              } else {
                const id = contextMenu.item._id;
                const name = 
                  contextMenu.type === 'year'    ? contextMenu.item.title :
                  contextMenu.type === 'subject' ? contextMenu.item.name :
                                                    contextMenu.item.title;
                setDeleteTarget({ mode: 'item', type: contextMenu.type, id, name });
              }
              setContextMenu(null);
            }}
          >
            <FaTrash /> Delete
          </button>

        </div>
      )}

      {/* Rename Prompt */}
      {renaming && (
        <RenamePrompt
          currentName={
            renaming.type === 'year' ? renaming.item.title :
            renaming.type === 'subject' ? renaming.item.name :
            renaming.type === 'chapter' ? renaming.item.title :
            renaming.type === 'file' && renaming.item.type === 'notebook' ? renaming.item.name :
            renaming.item.title || renaming.item.name
          }
          onRename={async (newName) => {
            if (renaming.type === 'year') {
              await renameYear(renaming.item._id, newName);
            } else if (renaming.type === 'subject') {
              await renameSubject(renaming.item._id, newName);
            } else if (renaming.type === 'chapter') {
              await renameChapter(renaming.item._id, newName);
            } else if (renaming.type === 'file') {
              await handleRename(renaming.item, renaming.item.type, newName); // pass newName here
            }
            setRenaming(null);
          }}
          onCancel={() => setRenaming(null)}
        />
      )}

      {/* Move Modal */}
      {/* {moving && (
        <MoveModal
          item={moving}
          onMove={(destination) => {
            // Handle move logic here
            console.log('Moving item:', moving, 'to:', destination);
            setMoving(null);
          }}
          onClose={() => setMoving(null)}
        />
      )} */}

      {/* Delete Confirmation Modal */}
     {deleteTarget && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?<br/>
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                className="delete-btn"
                onClick={async () => {
                  // call the correct handler based on mode
                  if (deleteTarget.mode === 'item') {
                    await handleDeleteItem(deleteTarget.type, deleteTarget.id);
                  } else {
                    await handleDeleteFile(deleteTarget.file, deleteTarget.fileType);
                  }
                  setDeleteTarget(null);
                }}
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