// Popover.jsx
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import AiHelpers from './AiHelpers';
import './Popover.css';

const Popover = ({ anchorRef, onClose, children, text }) => {
  const popoverRef = useRef();

  
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  // Compute position relative to the page
  const getPosition = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return { top: 0, left: 0 };
    return {
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX
    };
  };
  const position = getPosition();

  // Render into the body
  return ReactDOM.createPortal(
    <div
      className="custom-popover"
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 2147483647,        // ensure it’s on top
        // background: 'black',      
        color: 'white',             // black text
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '6px',
        padding: '12px',
        minWidth: '200px'
      }}
    >
      <div class="popup-bubble">
        <h4 >AI Assistant</h4>
        <p>This is a smart suggestion tool. Add context below:</p>
        <p><strong>Text:</strong> {text}</p>
        <button className='ai-assistance-more' onClick={() => setCopilotOpen(true)}>expand</button>
        
          
      </div>
      {copilotOpen && (
        <AiHelpers
          text={text}
          onClose={() => setCopilotOpen(false)}
        />
      )}
      

      {/* {children} */}
    </div>,
    document.body
  );
};

export default Popover;
