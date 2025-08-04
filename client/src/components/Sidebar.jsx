import React, { useState } from "react";
import { FaBook, FaFileAlt, FaUserCircle, FaMoon } from "react-icons/fa";
import "./Sidebar.css";
import { Link } from "react-router-dom";


const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
  return (
    // <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
    <div className={`sidebar `}>

      {/* Menu Items */}
      <ul className="sidebar-menu">
        <li className="menu-item-logo ">
          <img src="./src//assets/750003cb-fc39-41be-a28a-be393bf1013a.jpg" alt="" />
        </li>
        <li className="menu-item ">
          <Link to="/academic-org">
            <FaFileAlt className="menu-icon" />
            <span>NoteBook</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/notebook">
            <FaBook className="menu-icon" />
            <span>Resume </span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/interview">
            <FaBook className="menu-icon" />
            <span>Map</span>
          </Link>
        </li>

      </ul>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="menu-item">
         <Link to="/theme">
          <FaMoon className="menu-icon" />
        </Link>
        </div>
        <div className="menu-item">
         <Link to="/profile">
          <FaUserCircle className="menu-icon" />
        </Link>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
