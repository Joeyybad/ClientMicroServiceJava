import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, formatDate } from "../services/api.js";
import "../css/events.css";
function Events() {
  const navigate = useNavigate();

  // États
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Impossible de récupérer les événements (Erreur réseau ou Serveur éteint)"
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Événements reçus :", data);
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Gestion de l'affichage pendant le chargement ou erreur
  if (loading)
    return (
      <div className="page-container">
        <p>Chargement des événements...</p>
      </div>
    );
  if (error)
    return (
      <div className="page-container">
        <p style={{ color: "red" }}>Erreur : {error}</p>
      </div>
    );

  return (
    <div className="page-container">
      <h1 className="page-title">Événements à venir</h1>

      {events.length === 0 ? (
        <p>Aucun événement disponible pour le moment.</p>
      ) : (
        /* On remet la grille de cartes ici */
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="card-header">
                {/* Placeholder d'image avec les 2 premières lettres du titre */}
                <div className="event-image-placeholder">
                  {event.titre
                    ? event.titre.substring(0, 2).toUpperCase()
                    : "EV"}
                </div>
              </div>

              <div className="card-body">
                <h3>{event.titre}</h3>
                <p className="event-date">📅 {formatDate(event.dateHeure)}</p>
                <p className="event-loc">📍 {event.lieu}</p>

                <div className="card-footer">
                  <span className="price-tag">{event.prix} €</span>
                  {/* Petit badge pour le statut (OUVERT/COMPLET) */}
                  <span
                    className={`status-badge ${
                      event.statut === "OUVERT" ? "green" : "red"
                    }`}
                  >
                    {event.statut}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
