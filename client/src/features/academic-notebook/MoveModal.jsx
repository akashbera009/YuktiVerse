import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import './MoveModal.css';

export default function MoveModal({ data, item, onMove, onClose }) {
  const [dest, setDest] = useState({ year: '', subject: '', chapter: '' });
  const firstSelectRef = useRef();

  // focus first dropdown on open
  useEffect(() => {
    firstSelectRef.current?.focus();
  }, []);

  const handleKey = e => {
    if (e.key === 'Escape') onClose();
  };

  const canMove = dest.year && dest.subject && dest.chapter;

  return (
    <div className="mm-backdrop" onClick={onClose} onKeyDown={handleKey} tabIndex={-1}>
      <div className="mm-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="mm-close" onClick={onClose}><FaTimes/></button>
        <h3 className="mm-title">Move “{item.name}” to:</h3>

        <div className="mm-fields">
          <select
            ref={firstSelectRef}
            className="mm-select"
            value={dest.year}
            onChange={e => setDest({ year: e.target.value, subject: '', chapter: '' })}
          >
            <option value="">Select Year…</option>
            {Object.keys(data).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {dest.year && (
            <select
              className="mm-select"
              value={dest.subject}
              onChange={e => setDest(d => ({ ...d, subject: e.target.value, chapter: '' }))}
            >
              <option value="">Select Subject…</option>
              {data[dest.year].subjects.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          )}

          {dest.subject && (
            <select
              className="mm-select"
              value={dest.chapter}
              onChange={e => setDest(d => ({ ...d, chapter: e.target.value }))}
            >
              <option value="">Select Chapter…</option>
              {Object.keys(
                data[dest.year]
                  .subjects.find(s => s.name === dest.subject)
                  .chapters
              ).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>

        <div className="mm-actions">
          <button className="mm-btn mm-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="mm-btn mm-move"
            disabled={!canMove}
            onClick={() => onMove(dest)}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}
