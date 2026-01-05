import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        {/* On garde le titre complet, le CSS s'occupera de le cacher/réduire */}
        <h2>MSJ</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {/* On sépare l'icône et le texte */}
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Accueil</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-event"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-text">Créer Event</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/events"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">Événements</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/my-registrations"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">🎟️</span>
              <span className="nav-text">Mes Inscriptions</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className="nav-icon">👤</span>
        <span className="nav-text">Utilisateur</span>
      </div>
    </div>
  );
}

export default Sidebar;
