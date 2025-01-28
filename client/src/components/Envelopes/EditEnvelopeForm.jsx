// client/src/components/Envelopes/EditEnvelopeForm.jsx

import React, { useState } from "react";

const EditEnvelopeForm = ({ envelope, onUpdateEnvelope, onCancel }) => {
  const [name, setName] = useState(envelope.name);
  const [type, setType] = useState(envelope.type);
  const [amount, setAmount] = useState(envelope.amount);
  const [goalAmount, setGoalAmount] = useState(envelope.goalAmount || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setError("Veuillez entrer un nom pour l'enveloppe.");
      return;
    }
    if (amount === "" || parseFloat(amount) < 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }
    if (
      type === "objectif" &&
      (goalAmount === "" || parseFloat(goalAmount) <= 0)
    ) {
      setError("Veuillez entrer un montant objectif valide.");
      return;
    }

    const updatedAmount = parseFloat(amount);
    // Vous pouvez ajuster la logique pour l'ajout ou la suppression de fonds
    onUpdateEnvelope(envelope._id, updatedAmount);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4>Modifier l'Enveloppe</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de l'enveloppe"
        required
        style={styles.input}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={styles.select}
      >
        <option value="simple">Simple</option>
        <option value="objectif">Avec Objectif</option>
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant (€)"
        required
        style={styles.input}
      />
      {type === "objectif" && (
        <input
          type="number"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          placeholder="Montant Objectif (€)"
          required
          style={styles.input}
        />
      )}
      <button type="submit" style={styles.button}>
        Mettre à jour
      </button>
      <button
        type="button"
        onClick={onCancel}
        style={{ ...styles.button, ...styles.cancelButton }}
      >
        Annuler
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const styles = {
  form: {
    marginTop: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  input: {
    marginRight: "0.5rem",
    padding: "0.3rem",
    marginBottom: "0.5rem",
    width: "calc(100% - 1rem)",
  },
  select: {
    marginRight: "0.5rem",
    padding: "0.3rem",
    marginBottom: "0.5rem",
    width: "100%",
  },
  button: {
    marginRight: "0.5rem",
    padding: "0.3rem 0.5rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "3px",
    backgroundColor: "#28a745",
    color: "#fff",
    marginTop: "0.5rem",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
};

export default EditEnvelopeForm;
