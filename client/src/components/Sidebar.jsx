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
           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-writing"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" /><path d="M16 7h4" /><path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" /></svg>
            <span>NoteBook</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/notebook" ? "active" : ""}`}>
          <Link to="/notebook">
           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-briefcase"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 13.478v4.522a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-4.522l.553 .277a20.999 20.999 0 0 0 18.897 -.002l.55 -.275zm-8 -11.478a3 3 0 0 1 3 3v1h2a3 3 0 0 1 3 3v2.242l-1.447 .724a19.002 19.002 0 0 1 -16.726 .186l-.647 -.32l-1.18 -.59v-2.242a3 3 0 0 1 3 -3h2v-1a3 3 0 0 1 3 -3h4zm-2 8a1 1 0 0 0 -1 1a1 1 0 1 0 2 .01c0 -.562 -.448 -1.01 -1 -1.01zm2 -6h-4a1 1 0 0 0 -1 1v1h6v-1a1 1 0 0 0 -1 -1z" /></svg>
            <span>Job</span>
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
            {/* <button> */}
              <FaMoon className="menu-icon" />
            {/* </button> */}
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
