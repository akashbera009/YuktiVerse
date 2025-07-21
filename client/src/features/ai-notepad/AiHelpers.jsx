import React, { useState } from 'react';
import './AiHelper.css';

const AiHelpers = ({ text, onClose }) => {
 const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = () => {
    // Simulated response for now
    const aiResponse = `AI Response to: "${prompt}" based on box text: "${text}"`;
    setResponse(aiResponse);
  };

  return (
    <div className="copilot-panel">
      <div className="copilot-header">
        <span>Personal AI Assistant</span>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="copilot-body">
        <div className="original-text">
          <strong>Text from box:</strong>
          <p>{text}</p>
        </div>

        <div className="user-input">
          <textarea
            placeholder="Ask something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>

        {response && (
          <div className="ai-response">
            <strong>AI Response:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiHelpers;
