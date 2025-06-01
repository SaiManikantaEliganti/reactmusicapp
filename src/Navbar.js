import React from "react";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-spacer" />
      {user && (
        <div className="navbar-user">
          <span className="navbar-profile-type">User</span>
          <button className="navbar-logout" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}