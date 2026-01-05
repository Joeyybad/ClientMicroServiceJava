import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import PaymentModal from "../components/ui/PaymentModal";
import "../css/events.css";

function Event() {
  const { id } = useParams();

  // Données
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  // Gestion du formulaire et des étapes
  const [email, setEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );
  const [registrationData, setRegistrationData] = useState(null);
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
  const handlePaymentConfirm = () => {
    if (!registrationData) return;

    setPaymentModalOpen(false);

    // Préparation des données
    const paymentPayload = {
      registrationId: registrationData.id,
      montant: event.prix,
      devise: "EUR",
      // Si besoin des infos de carte (token), tu peux les ajouter ici :
      // cardHolder: cardData.name
    };

    console.log("Envoi au service paiement...", paymentPayload);

    fetch(`http://localhost:8081/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentPayload),
    })
      .then((res) => res.json())
      .then((paymentResponse) => {
        console.log("Paiement réussi", paymentResponse);
        setStep(2); // On passe à l'écran de succès
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
              <div className="payment-area">
                <p>
                  Place réservée. Montant à régler :{" "}
                  <strong>{event.prix} €</strong>
                </p>

                {/* ATTENTION : On ne lance plus le fetch, on ouvre juste la modale */}
                <button
                  className="btn-primary-large"
                  style={{ backgroundColor: "#16a34a" }}
                  onClick={() => setPaymentModalOpen(true)} // <--- CLIC ICI
                >
                  💳 Payer maintenant
                </button>
              </div>
            )}

            {/* ÉTAPE 2 : Succès Final */}
            {step === 2 && (
              <div
                className="success-area"
                style={{ textAlign: "center", animation: "fadeIn 0.5s" }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎉</div>
                <h3>Félicitations !</h3>
                <p>Votre inscription est confirmée.</p>

                {/* --- Service NOTIFICATION --- */}
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    margin: "20px 0",
                  }}
                >
                  Un email de confirmation a été envoyé à{" "}
                  <strong>{email}</strong>.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  {/* Bouton retour liste */}
                  <button
                    className="btn-detail"
                    onClick={() => (window.location.href = "/my-registrations")}
                  >
                    Voir mes billets
                  </button>

                  {/* --- Service FACTURATION --- */}

                  <button
                    className="btn-detail"
                    style={{
                      backgroundColor: "#e2e8f0",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                    }}
                    onClick={() =>
                      alert(
                        "Le téléchargement de la facture sera disponible une fois le microservice Facturation connecté."
                      )
                    }
                  >
                    📄 Télécharger la facture
                  </button>
                </div>
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
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        amount={event ? event.prix : 0}
        eventTitle={event ? event.titre : ""}
      />
    </div>
  );
}

export default Event;
