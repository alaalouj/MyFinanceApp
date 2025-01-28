// client/src/components/Envelopes/EnvelopeItem.jsx

import React, { useState } from "react";
import ProgressBar from "../UI/ProgressBar";

const EnvelopeItem = ({ envelope, onUpdate, onDelete }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAddAmount = (e) => {
    e.preventDefault();
    if (amount === "") {
      setError("Veuillez entrer un montant.");
      return;
    }
    onUpdate(envelope._id, parseFloat(amount));
    setAmount("");
    setError("");
  };

  return (
    <li
      style={{
        marginBottom: "1rem",
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "5px",
      }}
    >
      <h4>{envelope.name}</h4>
      <p>Type : {envelope.type === "simple" ? "Simple" : "Avec Objectif"}</p>
      <p>Montant Actuel : {envelope.amount} €</p>
      {envelope.type === "objectif" && envelope.goalAmount && (
        <div>
          <p>Objectif : {envelope.goalAmount} €</p>
          <ProgressBar progress={envelope.progress} />
          <p>Progression : {envelope.progress.toFixed(2)}%</p>
        </div>
      )}
      <form onSubmit={handleAddAmount} style={{ marginTop: "0.5rem" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ajouter/Retirer (€)"
          required
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">Mettre à jour</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={() => onDelete(envelope._id)}
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        Supprimer
      </button>
    </li>
  );
};

export default EnvelopeItem;
