import React, { useState } from "react";
import "../css/payment.css";

function Payment() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' ou 'error'
  const [errorMessage, setErrorMessage] = useState("");

  // Simulation des données
  const orderDetails = {
    registrationId: 101,
    amount: 49.99,
    currency: "EUR",
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setStatus(null);
    setErrorMessage("");

    // 1. On prépare l'objet JSON
    const paymentPayload = {
      registrationId: orderDetails.registrationId,
      montant: orderDetails.amount,
      devise: orderDetails.currency,
      statut: "PENDING",
      reference: "REF-" + Date.now(),
    };

    try {
      // 2. Appel DIRECT au backend Spring Boot ici (au lieu de passer par un service)
      const response = await fetch("http://localhost:8080/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });

      // 3. Gestion manuelle des erreurs HTTP (car fetch ne le fait pas tout seul)
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }

      const result = await response.json();

      console.log("Succès:", result);
      setStatus("success");
    } catch (error) {
      console.error("Échec:", error);
      setStatus("error");
      setErrorMessage("Impossible de contacter le serveur de paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Règlement sécurisé</h2>
          <p>Inscription # {orderDetails.registrationId}</p>
        </div>

        <div className="amount-display">{orderDetails.amount} €</div>

        {status === "success" ? (
          <div className="status-message success">
            Paiement validé avec succès !
          </div>
        ) : (
          <>
            <button
              className="payment-btn"
              onClick={handleConfirmPayment}
              disabled={loading}
            >
              {loading ? "Traitement en cours..." : "Confirmer le paiement"}
            </button>

            {status === "error" && (
              <div className="status-message error"> {errorMessage}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Payment;
