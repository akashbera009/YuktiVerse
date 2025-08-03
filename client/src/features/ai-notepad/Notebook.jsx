// npm install react-rnd                pore ekbar dekhar ache jinista ki 


import React, { useState, useRef, useEffect } from 'react';
import './Notebook.css';
import Popover from './Popover';
import axios from 'axios'

const Notebook = ({notebookId, notebookName }) => {
  const [textBoxes, setTextBoxes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const canvasRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [popoverBoxId, setPopoverBoxId] = useState(null);
  const aiButtonRefs = useRef({});

  const[data , setData] = useState(null);
// console.log(textBoxes);

    useEffect(() => {
    const loadNotebook = async () => {
      try {
        setIsLoading(true);
        if (notebookId) {
          const response = await axios.get(`/api/notebooks/${notebookId}`);
          const notebook = response.data;
          
          if (notebook.content?.textBoxes) {
            setTextBoxes(notebook.content.textBoxes);
          }
        }
      } catch (error) {
        console.error('Error loading notebook:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotebook();
  }, [notebookId]);

// const createNotebook =  async()=>{ /// create notebook in the databse 
//   try{
//     setIsSaving(true);
//     const payload = {
//       note_id: notebookId, 
//       name: notebookName, 
//       content: {
//         textBoxes: textBoxes, 
//       },
//     };
//     const response = await axios.post(`/api/notebooks/`, payload);
//     console.log('Notebook updated:', response.data);
//   }
//   catch(e){
//     console.log(e);
//   }finally{
//     setIsSaving(false);
//   }
// }
const saveNotebook = async () => {
  try {
    setIsSaving(true);

    const payload = {
      name: notebookName, // assume you have this in state
      content: {
        textBoxes: textBoxes, // the current state
      },
    };

    const response = await axios.put(`/api/notebooks/${notebookId}`, payload);

    console.log('Notebook updated:', response.data);
    // Optionally show a toast or UI feedback
  } catch (error) {
    console.error('Error saving notebook:', error);
    // Optionally handle 404 or 500 errors
  } finally {
    setIsSaving(false);
  }
};

  // Handle canvas clicks to create new text boxes
  const handleCanvasClick = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    
    if (e.target !== canvasRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Generate more unique ID
    const newBox = { 
      x, 
      y, 
      text: '', 
      id: `${Date.now()}-${Math.random()}`,
      width: 200,
      height: 28
    };
    
    setTextBoxes([...textBoxes, newBox]);
    setActiveId(newBox.id);
  };



  // Handle text changes and auto-resize
  const handleTextChange = (id, e) => {
    const newText = e.target.value;
    
    setTextBoxes(textBoxes.map(box => {
      if (box.id === id) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        const newHeight = Math.max(28, textarea.scrollHeight);
        
        return { 
          ...box, 
          text: newText,
          height: newHeight
        };
      }
      return box;
    }));
  };

  // Handle text box deletion
  const handleDelete = (id, e) => {
    e.stopPropagation();
    setTextBoxes(textBoxes.filter(box => box.id !== id));
  };

  // Handle AI button click
const handleAIButton = (id, e) => {
  e.stopPropagation();
  console.log("clicked AI on box", id);
  setPopoverBoxId(prev => (prev === id ? null : id));
};


  // Handle drag start
  const handleDragStart = (id, e) => {
    if (e.target.classList.contains('drag-handle')) {
      isDragging.current = true;
      setActiveId(id);
      const rect = e.currentTarget.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Handle dragging
  const handleDrag = (id, e) => {
    if (!isDragging.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.current.x;
    const y = e.clientY - rect.top - dragOffset.current.y;
    
    // Boundary checks to keep within canvas
    const boundedX = Math.max(0, Math.min(x, rect.width - 200));
    const boundedY = Math.max(0, Math.min(y, rect.height - 28));
    
    setTextBoxes(textBoxes.map(box => 
      box.id === id ? { ...box, x: boundedX, y: boundedY } : box
    ));
  };

  // Handle drag end
  const handleDragEnd = () => {
    isDragging.current = false;
  };

  // disappear if no text 
  const handleBlur = (id) => {
  const box = textBoxes.find(b => b.id === id);
  if (box && box.text.trim() === '') {
    setTextBoxes(prev => prev.filter(b => b.id !== id));
  }
};


  // Close active text box when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.text-box-container')) {
        setActiveId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Add global mouse move and mouse up listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging.current && activeId) {
        handleDrag(activeId, e);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeId, textBoxes]);

  return (
    <div className="notebook-container">
      {isLoading ? (
        <div className="loading-indicator">Loading notebook...</div>
      ) : (
        <>
      <div className="notebook-canvas">
        <div className="grid-lines"></div>
        
        <div className="notebook-header">
          <h2>{notebookName}</h2>
          <div className="save-controls">
            <button 
              className="save-button" 
              onClick={saveNotebook}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Notebook'}
            </button>
            {saveStatus && <div className="save-status">{saveStatus}</div>}
          </div>
        </div>

        <div 
          className="canvas" 
          ref={canvasRef}
          onClick={handleCanvasClick}
        >
          {textBoxes.map(box => (
            <div
              key={box.id}
              className={activeId === box.id ? 'text-box-container active' : 'text-box-container'}
              style={{ 
                left: box.x, 
                top: box.y,
                width: box.width
              }}
              onMouseDown={(e) => handleDragStart(box.id, e)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(box.id);
              }}
            >
              <div className="drag-handle">...</div>
              <textarea
                className="text-box"
                value={box.text}
                onChange={(e) => handleTextChange(box.id, e)}
                onBlur={() => handleBlur(box.id)}
                placeholder="Type here..."
                style={{ height: box.height }}
                autoFocus={activeId === box.id}
              />
              {activeId === box.id && (
                <div className="text-box-buttons">
                  <button
                    className="ai-button"
                    onClick={(e) => handleAIButton(box.id, e)}
                    title="AI Assistant"
                    ref={(el) => (aiButtonRefs.current[box.id] = el)}
                  >
                    AI
                  </button>

                  {popoverBoxId === box.id && aiButtonRefs.current[box.id] && (
                    <Popover
                      anchorRef={{ current: aiButtonRefs.current[box.id] }}
                      onClose={() => setPopoverBoxId(null)}
                      text={box.text}
                        id={box.id}
                    >
                    </Popover>
                  )}

                  <button
                    className="delete-button"
                    onClick={(e) => handleDelete(box.id, e)}
                    title="Delete note"
                  >
                    ×
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
      {/* Improved save status display */}
          {saveStatus && (
            <div className={`save-status ${saveStatus.includes('Failed') ? 'error' : 'success'}`}>
              {saveStatus}
            </div>
          )}
     </>
      )}
    </div>
  );
};
export default Notebook;


// Example notebook file structure
// {
//   type: 'notebook',
//   name: 'Calculus Notes',
//   content: {
//     textBoxes: [
//       {
//         id: 123456789,
//         text: 'Derivative formulas',
//         x: 100,
//         y: 50,
//         width: 200,
//         height: 80
//       },
//       {
//         id: 987654321,
//         text: 'Integration techniques',
//         x: 150,
//         y: 200,
//         width: 250,
//         height: 120
//       }
//     ]
//   }
// }