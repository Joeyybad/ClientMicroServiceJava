import React, { useState, useEffect } from "react";
import { API_BASE_URL, formatDate } from "../services/api";
import "../css/events.css";

const MyRegistrations = () => {
  // On récupère l'email du localStorage dès l'initialisation du state
  // Cela évite d'avoir à faire un setEmail dans le useEffect
  const [email, setEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );

  const [registrations, setRegistrations] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // 1. Charger la liste des événements (inchangé)
  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((evt) => {
          map[evt.id] = evt;
        });
        setEventsMap(map);
      })
      .catch((err) => console.error("Erreur chargement events", err));
  }, []);

  // 2. Fonction de recherche (utilisée par le formulaire)
  const searchRegistrations = (emailToSearch) => {
    if (!emailToSearch) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    // Sauvegarde l'email
    localStorage.setItem("userEmail", emailToSearch);

    fetch(`${API_BASE_URL}/events/my-registrations?email=${emailToSearch}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        return res.json();
      })
      .then((data) => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger vos inscriptions.");
        setLoading(false);
      });
  };

  // 3. useEffect pour le chargement automatique au démarrage
  useEffect(() => {
    // Si on a un email initialisé (depuis le localStorage), on lance la recherche
    if (email) {
      // Note : On copie la logique ici ou on appelle la fonction externe.
      // Pour éviter l'erreur de dépendance, on appelle la fonction searchRegistrations
      // MAIS on ajoute le commentaire eslint-disable pour dire à React "T'inquiète, je gère".
      searchRegistrations(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Le tableau vide [] force l'exécution UNE SEULE FOIS au montage

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRegistrations(email);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Mes Inscriptions</h1>

      <div
        className="form-container"
        style={{ maxWidth: "500px", marginBottom: "30px", textAlign: "center" }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <input
            type="email"
            placeholder="Votre email d'inscription..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            className="btn-primary-large"
            style={{ width: "auto", marginTop: 0 }}
          >
            Voir mes billets
          </button>
        </form>
      </div>

      {loading && <p>Recherche de vos billets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && searched && registrations.length === 0 && (
        <p>Aucune inscription trouvée pour cet email.</p>
      )}

      <div className="events-grid">
        {registrations.map((reg) => {
          const eventDetails = eventsMap[reg.eventId] || {};
          return (
            <div
              key={reg.id}
              className="event-card"
              style={{ cursor: "default" }}
            >
              <div
                className="card-header"
                style={{ backgroundColor: "#475569" }}
              >
                <div
                  className="event-image-placeholder"
                  style={{ backgroundColor: "transparent", color: "white" }}
                >
                  TICKET #{reg.id}
                </div>
              </div>
              <div className="card-body">
                <h3>{eventDetails.titre || `Événement #${reg.eventId}`}</h3>
                <p className="event-date">
                  📅 Inscrit le : {formatDate(reg.dateInscription)}
                </p>
                {eventDetails.lieu && (
                  <p className="event-loc">📍 {eventDetails.lieu}</p>
                )}
                <div className="card-footer">
                  <span
                    className={`status-badge ${
                      reg.statutPaiement === "VALIDE" ? "green" : "orange"
                    }`}
                  >
                    {reg.statutPaiement || "EN ATTENTE"}
                  </span>
                  {eventDetails.id && (
                    <a
                      href={`/events/${eventDetails.id}`}
                      style={{ fontSize: "0.8rem", color: "#3b82f6" }}
                    >
                      Voir l'offre
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRegistrations;
