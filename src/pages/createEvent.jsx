import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import GenericForm from "../components/ui/GenericForm";
import "../css/events.css";

function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // CONFIGURATION DU FORMULAIRE

  const eventFormConfig = [
    // Ligne 1 : Titre
    {
      name: "titre",
      label: "Titre de l'événement",
      type: "text",
      required: true,
      placeholder: "Ex: Concert Rock",
    },

    // Ligne 2 : Description
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 4,
      placeholder: "Détails...",
    },

    // Ligne 3 (Tableau = Côte à côte) : Date et Lieu
    [
      {
        name: "dateHeure",
        label: "Date et Heure",
        type: "datetime-local",
        required: true,
      },
      {
        name: "lieu",
        label: "Lieu",
        type: "text",
        required: true,
        placeholder: "Paris, Zoom...",
      },
    ],

    // Ligne 4 (Tableau) : Prix et Capacité
    [
      {
        name: "prix",
        label: "Prix (€)",
        type: "number",
        step: "0.01",
        min: 0,
        required: true,
      },
      {
        name: "capaciteMax",
        label: "Capacité Max",
        type: "number",
        min: 1,
        required: true,
      },
    ],

    // Ligne 5 : Statut (Select)
    {
      name: "statut",
      label: "Statut initial",
      type: "select",
      required: true,
      options: [
        { value: "OUVERT", label: "Ouvert aux inscriptions" },
        { value: "BROUILLON", label: "Brouillon (Caché)" },
        { value: "FERME", label: "Fermé" },
      ],
    },
  ];

  // 2. VALEURS PAR DÉFAUT
  const initialValues = {
    titre: "",
    description: "",
    lieu: "",
    dateHeure: "",
    prix: 0,
    capaciteMax: 100,
    statut: "OUVERT",
  };

  // LOGIQUE D'ENVOI (API)
  const handleCreate = (data) => {
    setLoading(true);

    // Conversion des types si nécessaire (ex: prix en float)
    const payload = {
      ...data,
      prix: parseFloat(data.prix),
      capaciteMax: parseInt(data.capaciteMax),
    };

    fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur création");
        return res.json();
      })
      .then(() => {
        setLoading(false);
        navigate("/events");
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Créer un nouvel événement</h1>
      <GenericForm
        fields={eventFormConfig}
        initialValues={initialValues}
        onSubmit={handleCreate}
        submitLabel="Publier l'événement"
        loading={loading}
      />
    </div>
  );
}

export default CreateEvent;
