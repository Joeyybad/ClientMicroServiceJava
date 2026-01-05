import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import "../css/events.css";

function Event() {
  const { id } = useParams();

  // Données
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gestion du formulaire et des étapes
  const [email, setEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );
  const [registrationData, setRegistrationData] = useState(null); // Stockera l'inscription créée (ID, statut...)
  const [step, setStep] = useState(0); // 0 = Inscription, 1 = Paiement, 2 = Terminé
  const [feedback, setFeedback] = useState("");

  // Charger l'événement (Identique à avant)
  useEffect(() => {
    fetch(`${API_BASE_URL}/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Événement introuvable");
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // --- ÉTAPE 1 : Inscription Service  ---
  const handleRegister = () => {
    if (!email) {
      alert("Veuillez entrer votre email.");
      return;
    }
    localStorage.setItem("userEmail", email);

    // Appel du service event pour réserver la place
    fetch(`${API_BASE_URL}/events/${id}/register?email=${email}`, {
      method: "POST",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erreur lors de l'inscription");
        }
        return res.json();
      })
      .then((data) => {
        // SUCCÈS : On stocke l'inscription et on passe à l'étape paiement
        setRegistrationData(data); // data contient { id: 123, statutPaiement: "EN_ATTENTE" }
        setStep(1); // On change l'affichage pour montrer le bouton de paiement
        setFeedback("✅ Place réservée ! Veuillez procéder au paiement.");
      })
      .catch((err) => {
        setFeedback("❌ Erreur : " + err.message);
      });
  };

  // --- ÉTAPE 2 : Paiement service ---
  const handlePayment = () => {
    if (!registrationData) return;

    const paymentPayload = {
      registrationId: registrationData.id, // On envoie l'ID de l'inscription pour faire le lien
      montant: event.prix,
      devise: "EUR",
    };

    console.log("Envoi au service paiement...", paymentPayload);

    // A remplacer par le fetch du paiement service
    fetch(`http://localhost:8081/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentPayload),
    })
      .then((res) => res.json())
      .then((paymentResponse) => {
        console.log("Paiement réussi", paymentResponse);
        setStep(2);
        setFeedback("✅ Paiement validé ! Votre inscription est confirmée.");
      })
      .catch((err) => {
        console.error("Erreur paiement", err);
        alert("Erreur lors du paiement. Le service est peut-être éteint.");
      });
  };

  if (loading)
    return (
      <div className="event-detail-container">
        <p>Chargement...</p>
      </div>
    );
  if (error)
    return (
      <div className="event-detail-container">
        <p style={{ color: "red", fontWeight: "bold" }}>
          Une erreur est survenue : {error}
        </p>
        <button className="btn-detail" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  if (!event) return null;

  return (
    <div className="event-detail-container">
      {/* Header et Description */}
      <div className="detail-header">
        <h1>{event.titre}</h1>
        <span
          className={`status-badge ${
            event.statut === "OUVERT" ? "green" : "red"
          }`}
        >
          {event.statut}
        </span>
      </div>

      <div className="detail-content">
        <div className="info-section">
          {/* ... Détails de l'event ... */}
          <p>{event.description}</p>
          <ul>
            <li>Prix : {event.prix} €</li>
          </ul>
        </div>

        <div className="action-section">
          <div className="ticket-widget">
            <h3>Réserver ma place</h3>

            {/* --- GESTION DES ÉTAPES --- */}

            {/* Etape 0 : Formulaire d'inscription */}
            {step === 0 && event.statut === "OUVERT" && (
              <>
                <div style={{ marginBottom: "15px", textAlign: "left" }}>
                  <label>Votre Email :</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                  />
                </div>
                <button className="btn-primary-large" onClick={handleRegister}>
                  Réserver (Étape 1/2)
                </button>
              </>
            )}

            {/* Etape 1  Bouton de Paiement Apparaît seulement après inscription */}
            {step === 1 && (
              <div
                className="payment-area"
                style={{ animation: "fadeIn 0.5s" }}
              >
                <p style={{ marginBottom: 15 }}>
                  Place réservée (N°{registrationData.id}).
                  <br />
                  Montant à régler : <strong>{event.prix} €</strong>
                </p>

                {/* Paiement Service */}
                <button
                  className="btn-primary-large"
                  style={{ backgroundColor: "#16a34a" }}
                  onClick={handlePayment}
                >
                  💳 Payer maintenant
                </button>
              </div>
            )}

            {/* ÉTAPE 2 : Succès Final */}
            {step === 2 && (
              <div className="success-area">
                <h3>🎉 Félicitations !</h3>
                <p>Vous êtes inscrit et le paiement est validé.</p>
                <button
                  className="btn-detail"
                  onClick={() => (window.location.href = "/my-registrations")}
                >
                  Voir mon billet
                </button>
              </div>
            )}

            {/* Feedback Message */}
            {feedback && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  borderRadius: "5px",
                  background: feedback.includes("✅") ? "#dcfce7" : "#fee2e2",
                  color: feedback.includes("✅") ? "#166534" : "#991b1b",
                }}
              >
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
