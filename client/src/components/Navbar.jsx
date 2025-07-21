// components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll add this next

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">YuktiVerse</Link>
      </div>

      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/academic-org" onClick={() => setIsOpen(false)}>Academic Organizer</Link>
        <Link to="/notebook" onClick={() => setIsOpen(false)}>Notebook</Link>
      </div>

      <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </div>
    </nav>
  );
};

export default Navbar;
