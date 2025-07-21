import React, { useState, useRef, useEffect } from 'react';
import './Notebook.css';
import Popover from './Popover';

const Notebook = () => {
  const [textBoxes, setTextBoxes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const canvasRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // pop over states 
  const [popoverBoxId, setPopoverBoxId] = useState(null);
  // const [popoverBoxVisivle, setPopoverBoxVisivle] = useState(false);
  const aiButtonRefs = useRef({});  // To store button refs by box id


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
    
    setTextBoxes([...textBoxes, { 
      x, 
      y, 
      text: '', 
      id: Date.now(),
      width: 200,
      height: 28
    }]);
    setActiveId(Date.now());
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
      
      <div className="notebook-canvas">
        <div className="grid-lines"></div>
        <div 
          className="canvas" 
          ref={canvasRef}
          onClick={handleCanvasClick}
        >
          {textBoxes.map(box => (
            <div
              key={box.id}
              className={`text-box-container ${activeId === box.id ? 'active' : ''}`}
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
    </div>
  );
};

export default Notebook;