import React from "react";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  // Get the first letter of the email (before @, capitalized)
  const getInitial = email => {
    if (!email) return "";
    return email[0].toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-spacer" />
      {user && (
        <div className="navbar-user">
          <div className="navbar-profile-avatar" title={user.email}>
            {getInitial(user.email)}
          </div>
          <button className="navbar-logout" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}