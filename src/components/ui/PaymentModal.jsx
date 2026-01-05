import React, { useState } from "react";
import "../../css/modal.css";

const PaymentModal = ({ isOpen, onClose, onConfirm, amount, eventTitle }) => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onConfirm(cardData);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-header">
          <h2>Paiement Sécurisé</h2>
          <div className="amount-display">{amount} €</div>
          <p className="payment-desc">Pour : {eventTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Nom du titulaire</label>
            <input
              type="text"
              name="name"
              placeholder="M. Jean Dupont"
              value={cardData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Numéro de carte</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              maxLength="19"
              value={cardData.cardNumber}
              onChange={handleChange}
            />
            <span className="secure-icon">🔒</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiration</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/AA"
                maxLength="5"
                value={cardData.expiry}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input
                type="text"
                name="cvc"
                placeholder="123"
                maxLength="3"
                value={cardData.cvc}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-pay" disabled={isProcessing}>
            {isProcessing ? "Traitement..." : `Payer ${amount} €`}
          </button>
        </form>

        <div className="stripe-badge">
          Paiement sécurisé par <strong>Stripe</strong> (Simulation)
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
