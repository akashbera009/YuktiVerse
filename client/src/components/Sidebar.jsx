import React, { useState } from "react";
import { FaBook, FaFileAlt, FaUserCircle, FaMoon } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
  return (
    // <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
    <div className={`sidebar `}>

      {/* Menu Items */}
      <ul className="sidebar-menu">
        <li className="menu-item active">
          <FaFileAlt className="menu-icon" />
          { <span>NoteBook</span>}
        </li>
        <li className="menu-item">
          <FaBook className="menu-icon" />
          { <span>Blogs</span>}
        </li>
        <li className="menu-item">
          <FaBook className="menu-icon" />
          { (
            <>
              <span>Interview</span>
              {/* <span className="new-badge">New</span> */}
            </>
          )}
        </li>
      </ul>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="menu-item">
          <FaMoon className="menu-icon" />
        </div>
        <div className="menu-item">
          <FaUserCircle className="menu-icon" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
