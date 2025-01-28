// client/src/components/Envelopes/CreateEnvelopeForm.jsx

import React, { useState } from "react";

const CreateEnvelopeForm = ({ onAddEnvelope }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("simple");
  const [goalAmount, setGoalAmount] = useState("");
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

    const envelopeData = {
      name,
      type,
      amount: 0, // Initialement, aucun montant alloué
      goalAmount: type === "objectif" ? parseFloat(goalAmount) : 0,
    };

    try {
      await onAddEnvelope(envelopeData);
      setName("");
      setType("simple");
      setGoalAmount("");
      setError("");
    } catch (err) {
      setError("Erreur lors de la création de l'enveloppe.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4>Créer une Nouvelle Enveloppe</h4>
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
      <button type="submit" style={styles.button}>
        Créer Enveloppe
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "600px",
    margin: "0 auto 2rem auto",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
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
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};

export default CreateEnvelopeForm;
