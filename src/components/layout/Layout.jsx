import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar.jsx";
import "../../css/layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        {/* Outlet rendra le composant de la page active (Events, Home, etc.) */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
