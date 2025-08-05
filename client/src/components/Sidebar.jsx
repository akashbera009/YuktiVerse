import React from "react";
import { FaBook, FaFileAlt, FaUserCircle, FaMoon } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="menu-item-logo">
          <img src="./src/assets/750003cb-fc39-41be-a28a-be393bf1013a.jpg" alt="" />
        </li>
        <li className={`menu-item ${location.pathname === "/academic-org" ? "active" : ""}`}>
          <Link to="/academic-org">
            <FaFileAlt className="menu-icon" />
            <span>NoteBook</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/notebook" ? "active" : ""}`}>
          <Link to="/notebook">
            <FaBook className="menu-icon" />
            <span>Resume</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/interview" ? "active" : ""}`}>
          <Link to="/interview">
            <FaBook className="menu-icon" />
            <span>Map</span>
          </Link>
        </li>
      </ul>

      <div className="sidebar-bottom">
        <div className={`menu-item ${location.pathname === "/theme" ? "active" : ""}`}>
          <Link to="/theme">
            <FaMoon className="menu-icon" />
          </Link>
        </div>
        <div className={`menu-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <Link to="/profile">
            <FaUserCircle className="menu-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
