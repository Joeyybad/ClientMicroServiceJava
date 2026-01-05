import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Microservices Java Client</h1>

      <div className="home-grid">
        {/* Carte vers le module Événements */}
        <div className="home-card">
          <h2>Événements</h2>
          <p>Découvrez les prochains concerts et conférences.</p>
          <Link to="/events">
            <button className="home-button">Voir les événements</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
