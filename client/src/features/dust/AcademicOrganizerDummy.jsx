import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcademicOrganizer = () => {
  const [years, setYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);


const [selectedFile, setSelectedFile] = useState(null);
const [viewerType, setViewerType] = useState(null);
const [notebookContent, setNotebookContent] = useState(null);


const [newYearTitle, setNewYearTitle] = useState('');
const [editingYearId, setEditingYearId] = useState(null);
const [yearEditValue, setYearEditValue] = useState('');

const [newSubjectName, setNewSubjectName] = useState('');
const [editingSubjectId, setEditingSubjectId] = useState(null);
const [subjectEditValue, setSubjectEditValue] = useState('');

const [newChapterTitle, setNewChapterTitle] = useState('');
const [editingChapterId, setEditingChapterId] = useState(null);
const [chapterEditValue, setChapterEditValue] = useState('');


const [showNotebookForm, setShowNotebookForm] = useState(false);
const [notebookId, setNotebookId] = useState('');
const [notebookName, setNotebookName] = useState('');
const [textBoxes, setTextBoxes] = useState([]); // Mocking one by default
const [isSaving, setIsSaving] = useState(false);




  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch all years on mount
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

    const handleYearClick = (yearId) => {
    if (selectedYearId === yearId) {
        setSelectedYearId(null);
        setSubjects([]);
        setChapters([]);
        setMaterials([]);
    } else {
        setSelectedYearId(yearId);
        setSubjects([]);
        setChapters([]);
        setMaterials([]);
    }
    };
  // 🔹 Fetch subjects when year is selected
  useEffect(() => {
    if (selectedYearId) {
      axios.get(`/years/${selectedYearId}/subjects`)
        .then(res => setSubjects(res.data))
        .catch(err => console.error('Error fetching subjects:', err));
    }
  }, [selectedYearId]);

  // 🔹 Fetch chapters when subject is selected
  useEffect(() => {
    if (!selectedSubjectId) return;
      axios.get(`/years/subjects/${selectedSubjectId}/chapters`)
        .then(res => {
          console.log("Chapters:", res.data);
          setChapters(res.data);
        })
        .catch(err => console.error('Error fetching chapters:', err));
  }, [selectedSubjectId]);

    // Example in materials fetch:
    useEffect(() => {
    if (selectedChapterId) {
        setLoading(true);
        setError(null);
        axios.get(`/years/${selectedChapterId}/materials`)
        .then(res => setMaterials(res.data))
        .catch(err => {
            console.error('Error fetching materials:', err);
            setError("Failed to load materials");
        })
        .finally(() => setLoading(false));
    }
    }, [selectedChapterId]);

    const handleSubjectClick = (subjectId) => {
        if (selectedSubjectId === subjectId) {
            setSelectedSubjectId(null);
        } else {
            setSelectedSubjectId(subjectId);
        }

        // Clear dependent states
        setChapters([]);
        setMaterials([]);
        setSelectedChapterId(null);
        setSelectedNotebook(null);
    };

    const handleChapterClick = (chapterId) => {
        if (selectedChapterId === chapterId) {
            setSelectedChapterId(null);
        } else {
            setSelectedChapterId(chapterId);
        }

        // Clear previous materials + notebook
        setMaterials([]);
        setSelectedNotebook(null);
    };

    
    const handleFileClick = async (file) => {
      setSelectedFile(file);
      setViewerType(null); // reset before loading new
      
      if (file.type === 'notebook') {
        try {
      const res = await axios.get(`/api/notebooks/${file.note_id}`);
      setNotebookContent(res.data);
      setViewerType('notebook');
    } catch (err) {
      console.error('Error loading notebook:', err);
    }
  } else if (file.type === 'handwritten') {
    setViewerType('pdf'); // we'll use file.fileUrl to view this
  } else {
    console.warn('Unknown file type');
  }
};

  const handleCloseFile = () => {
    setSelectedFile(null);
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
    console.log(yearId , newTitle);
    
    await axios.patch(`/years/rename/${yearId}`, { title: newTitle });
    setYears(prev => prev.map(y => y._id === yearId ? { ...y, title: newTitle } : y));
    setEditingYearId(null);
  } catch (err) {
    console.error("Rename year failed", err);
  }
};
const handleDeleteItem = async (type, id) => {
  if (!window.confirm("Are you sure you want to delete this item and all its contents?")) return;

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
};
const handleDeleteFile = async (file, type) => {
  if (!window.confirm("Are you sure you want to delete this file?")) return;

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
// console.log(subject);

  await axios.patch(`/years/subjects/rename/${subjectId}`, { name: newName });
    setSubjects(prev => 
      prev.map(s => s._id === subjectId ? { ...s, name:newName } : s));
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
    // alert("Failed to update chapter");
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

//  note book function 
const createNotebook = async () => {
  try {
    setIsSaving(true);
    
    const payload = {
      name: notebookName,
      chapter: selectedChapterId, 
      content: {
        textBoxes: textBoxes
      }
    };
    
    const response = await axios.post('/api/notebooks/', payload);
    console.log('Notebook created:', response.data);
    setMaterials(prev => ({
      ...prev,
      notebooks: [...(prev.notebooks || []), response.data]
    }));
    
    setNotebookName('');
    setTextBoxes([]);
    setShowNotebookForm(false);
    
  } catch (err) {
    console.error('Failed to create notebook:', err);
  } finally {
    setIsSaving(false);
  }
};
const viewNotebookById = async (noteId) => {
try {
    const res = await axios.get(`/api/notebooks/${noteId}`);
    setSelectedNotebook(res.data);
    console.log('viewing  notebook:', res.data);
} catch (err) {
    console.error('Failed to fetch notebook:', err);
}
};


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
const handleRename = async (file, type) => {
  const currentName = type === 'notebook' ? file.name : file.title;
  const newName = prompt("Enter new name:", currentName);
  if (!newName || newName === currentName) return;

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
  } catch (err) {
    console.error("Failed to toggle important:", err);
    alert("Could not update importance");
  }
};






  return (
    <div style={{ padding: 20 }}>
      <h2>Academic Organizer</h2>

      {/* Years */}
      <div>
        <h3>Years</h3>
        {years.map(year => (<div>
            <button
            key={year._id}
            onClick={() => handleYearClick(year._id)}
            style={{
                backgroundColor: selectedYearId === year._id ? '#add8e6' : '',
            }}
            >
            {year.title}{year.important ? '⭐' : ''}
            </button>
         
            <button onClick={() => handleToggleImportantYear(year._id)} style={{ marginLeft: 8 }}>
              {year.important ? 'Unmark' : 'Mark Important'}
            </button>

              <button onClick={() => {
                setEditingYearId(year._id);
                setYearEditValue(year.title);
              }}>✏️ Rename</button>
                <button onClick={() => handleDeleteItem('year', year._id)}>🗑️</button>
      
      {/* year rename modal  */}
      {editingYearId === year._id && (
      <>
        <input
          value={yearEditValue}
          onChange={(e) => setYearEditValue(e.target.value)}
        />
        <button onClick={() => renameYear(year._id, yearEditValue)}>Save</button>
        <button onClick={() => setEditingYearId(null)}>Cancel</button>
      </>
    )}
        </div>))}
      </div>

      {/* // this section need to be replaced with the existing create year  😂😂😂*/}
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="New Year Title"
          value={newYearTitle}
          onChange={(e) => setNewYearTitle(e.target.value)}
        />
        <button onClick={() => {
          if (newYearTitle.trim()) {
            handleCreateYear(newYearTitle);
            setNewYearTitle('');
          }
        }}>
          ➕ Add Year
        </button>
      
      </div>

            {/* Subjects */}
      {subjects.length > 0 && (
        <div>
          <h3>Subjects</h3>
            {subjects.map(sub => (<>
            <button key={sub._id} onClick={() => handleSubjectClick(sub._id)}>
                {sub.name}  {sub.important ? '⭐' : ''}
            </button>
            <button onClick={() => handleToggleImportantSubject(sub._id)} style={{ marginLeft: 8 }}>
              {sub.important ? 'Unmark' : 'Mark Important'}
            </button>
            <button onClick={() => {
              setEditingSubjectId(sub._id);
              setSubjectEditValue(sub.name);
            }}>✏️ Rename</button>
            <button onClick={() => handleDeleteItem('subject', sub._id)}>🗑️</button>
            
    {editingSubjectId === sub._id && (
      <>
        <input
          value={subjectEditValue}
          onChange={(e) => setSubjectEditValue(e.target.value)}
        />
        <button onClick={() => renameSubject(sub._id, subjectEditValue)}>Save</button>
        <button onClick={() => setEditingSubjectId(null)}>Cancel</button>
      </>
    )}
            <hr />
            </>))}
        </div>
      )}
         {/* this is also the create new subject  */}
        {selectedYearId && (
          <div style={{ marginTop: 10 }}>
            <input
              type="text"
              placeholder="New Subject Name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <button onClick={() => {
              if (newSubjectName.trim()) {
                handleCreateSubject(newSubjectName);
                setNewSubjectName('');
              }
            }}>
              ➕ Add Subject
            </button>
          </div>
        )}


      {/* Chapters */}
      {chapters.length > 0 && (
        <div>
          <h3>Chapters</h3>
            {chapters.map((chapter) => (
            <div key={chapter._id}>
                <button onClick={() => handleChapterClick(chapter._id)}>
                {chapter.title} {chapter.important ? '⭐' : ''}
                </button>
            <button 
            onClick={() => handleToggleImportantChapter(chapter._id)}
            style={{ marginLeft: 10 }}
          >
            {chapter.important ? 'Unmark Important' : 'Mark Important'}
          </button>
          <button onClick={() => {
          setEditingChapterId(chapter._id);
          setChapterEditValue(chapter.title);
        }}>✏️ Rename</button>
        <button onClick={() => handleDeleteItem('chapter', chapter._id)}>🗑️</button>

    {editingChapterId === chapter._id  && (
      <>
        <input
          value={chapterEditValue}
          onChange={(e) => setChapterEditValue(e.target.value)}
        />
        <button onClick={() => renameChapter(chapter._id, chapterEditValue)}>Save</button>
        <button onClick={() => setEditingChapterId(null)}>Cancel</button>
      </>
    )}
            </div>
            ))}

        </div>
      )}


       {selectedSubjectId && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="New Chapter Title"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
          />
          <button onClick={() => {
            if (newChapterTitle.trim()) {
              handleCreateChapter(newChapterTitle);
              setNewChapterTitle('');
            }
          }}>
            ➕ Add Chapter
          </button>
        </div>
      )}


<hr />


      {/* Materials */}
{materials.notebooks?.length > 0 && (
  <div>
    <h3>Notebooks</h3>
    {materials.notebooks.map((note) => (
      <div key={note._id} style={{ marginBottom: '1rem' }}>
        <p><strong>{note.name}</strong>
    <button onClick={() => handleRename(note, 'notebook')}>✏️</button>
    <button onClick={() => handleToggleImportant(note, 'notebook')}>
      {note.important ? '⭐' : '☆'}
    </button></p> 
        <p>Note ID: {note.note_id}</p>
        <button onClick={() => viewNotebookById(note.note_id)}>
          View Notebook
        </button>
        <button onClick={() => handleDeleteFile(note, 'notebook')}>🗑️</button>

      </div>
    ))}
    <hr />
  </div>
)}


{materials.handwrittenNotes?.length > 0 && (
  <div>
    <h3>Handwritten Notes</h3>
    {materials.handwrittenNotes.map((note) => (
      <div key={note._id} style={{ marginBottom: '1rem' }}>
        <p><strong>{note.title}</strong> ({note.fileType})
    <button onClick={() => handleRename(note, 'scanned')}>✏️</button>
    <button onClick={() => handleToggleImportant(note, 'scanned')}>
      {note.important ? '⭐' : '☆'}
    </button></p>
        <button onClick={() => handleFileClick({ 
          type: 'handwritten', 
          fileUrl: note.fileUrl, 
          name: note.title 
        })}>
          view pdf Note
        </button>
        <button onClick={() => handleDeleteFile(note, 'handwritten')}>🗑️</button>

      </div>
    ))}
  </div>
)}



{viewerType === 'notebook' && notebookContent && (
  <div style={{ marginTop: 20 }}>
    <h3>📝 Viewing Notebook: {selectedFile?.name}</h3>
    <pre>{JSON.stringify(notebookContent, null, 2)}</pre>
    <button onClick={() => {
      setSelectedFile(null);
      setNotebookContent(null);
      setViewerType(null);
    }}>
      Close Viewer
    </button>
  </div>
)}

{viewerType === 'pdf' && selectedFile && (
  <div style={{ marginTop: 20 }}>
    <h3>📄 Viewing PDF: {selectedFile.name}</h3>
    <iframe 
      src={selectedFile.fileUrl} 
      title="PDF Viewer" 
      width="100%" 
      height="500px" 
    />
    <br />
    <button onClick={() => {
      setSelectedFile(null);
      setViewerType(null);
    }}>
      Close Viewer
    </button>
  </div>
)}


{/* notebook related  */}
{selectedChapterId && (
  <div style={{ marginTop: 20 }}>
    <button onClick={() => setShowNotebookForm(true)}>
      ➕ Create Notebook
    </button>

    {showNotebookForm && (
      <div style={{
        border: '1px solid #ccc',
        padding: 16,
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9'
      }}>
        <h4>Create New Notebook</h4>

        <label>
          Notebook Name:
          <input
            type="text"
            value={notebookName}
            onChange={(e) => setNotebookName(e.target.value)}
            placeholder="e.g., Derivatives Summary"
          />
        </label>
        <br /><br />

        <button 
          onClick={createNotebook} 
          disabled={isSaving || !notebookName}
        >
          {isSaving ? 'Saving...' : 'Create'}
        </button>

        <button 
          onClick={() => setShowNotebookForm(false)} 
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    )}
  </div>
)}



{loading && <p>Loading materials...</p>}
{error && <p style={{color: 'red'}}>{error}</p>}


    </div>
  );
};

export default AcademicOrganizer;
