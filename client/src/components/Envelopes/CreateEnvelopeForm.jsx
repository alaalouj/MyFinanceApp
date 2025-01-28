// client/src/components/Envelopes/CreateEnvelopeForm.jsx

import React, { useState } from "react";

const CreateEnvelopeForm = ({ onAddEnvelope }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("simple"); // 'simple' or 'objectif'
  const [amount, setAmount] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
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

    const envelopeData = {
      name,
      type,
      amount: parseFloat(amount),
      goalAmount: type === "objectif" ? parseFloat(goalAmount) : undefined,
    };

    onAddEnvelope(envelopeData);
    setName("");
    setType("simple");
    setAmount("");
    setGoalAmount("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h4>Créer une nouvelle enveloppe</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de l'enveloppe"
        required
        style={{ marginRight: "0.5rem" }}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ marginRight: "0.5rem" }}
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
        style={{ marginRight: "0.5rem" }}
      />
      {type === "objectif" && (
        <input
          type="number"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          placeholder="Montant Objectif (€)"
          required
          style={{ marginRight: "0.5rem" }}
        />
      )}
      <button type="submit">Créer</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateEnvelopeForm;
