import React, { useState } from "react";
import "../../css/events.css";

function GenericForm({
  fields,
  onSubmit,
  submitLabel,
  initialValues = {},
  loading = false,
}) {
  // Initialisation du state avec les valeurs par défaut
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // On renvoie les données au parent
  };

  // Petite fonction utilitaire pour rendre un champ unique
  const renderField = (field) => {
    // Cas Spécial : Select
    if (field.type === "select") {
      return (
        <div className="form-group" key={field.name} style={{ flex: 1 }}>
          <label>{field.label}</label>
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Cas Spécial : Textarea
    if (field.type === "textarea") {
      return (
        <div className="form-group" key={field.name} style={{ flex: 1 }}>
          <label>{field.label}</label>
          <textarea
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows || 4}
          />
        </div>
      );
    }

    // Cas standard (input text, number, datetime, email, password)
    return (
      <div className="form-group" key={field.name} style={{ flex: 1 }}>
        <label>{field.label}</label>
        <input
          type={field.type}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder}
          min={field.min}
          step={field.step}
        />
      </div>
    );
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {fields.map((row, index) => {
          // Si 'row' est un tableau, c'est qu'on veut deux champs côte à côte
          if (Array.isArray(row)) {
            return (
              <div className="form-row" key={index}>
                {row.map((field) => renderField(field))}
              </div>
            );
          }
          // Sinon c'est une ligne normale
          return renderField(row);
        })}

        <button type="submit" className="btn-primary-large" disabled={loading}>
          {loading ? "Chargement..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default GenericForm;
