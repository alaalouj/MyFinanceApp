// client/src/components/Envelopes/EditEnvelopeForm.jsx

import React, { useState } from "react";

const EditEnvelopeForm = ({ envelope, onUpdateEnvelope, onCancel }) => {
  const [name, setName] = useState(envelope.name);
  const [type, setType] = useState(envelope.type);
  const [goalAmount, setGoalAmount] = useState(envelope.goalAmount);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setError("Le nom de l'enveloppe est requis.");
      return;
    }

    if (type === "objectif" && (!goalAmount || parseFloat(goalAmount) <= 0)) {
      setError("Veuillez entrer un objectif valide.");
      return;
    }

    const updateData = {
      name,
      type,
      goalAmount: type === "objectif" ? parseFloat(goalAmount) : 0,
    };

    try {
      await onUpdateEnvelope(envelope._id, updateData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'enveloppe.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4>Modifier Enveloppe</h4>
      <div style={styles.formGroup}>
        <label>Nom de l'Enveloppe:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.select}
        >
          <option value="simple">Simple</option>
          <option value="objectif">Avec Objectif</option>
        </select>
      </div>
      {type === "objectif" && (
        <div style={styles.formGroup}>
          <label>Objectif (Montant €):</label>
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            required
            min="0"
            style={styles.input}
          />
        </div>
      )}
      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.button}>
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Annuler
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "600px",
    margin: "1rem auto",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f8f9fa",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "0.5rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginRight: "0.5rem",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

export default EditEnvelopeForm;
