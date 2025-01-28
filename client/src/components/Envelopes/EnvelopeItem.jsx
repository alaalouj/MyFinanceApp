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
    <li>
      <h4>{envelope.name}</h4>
      <p>Type : {envelope.type === "simple" ? "Simple" : "Avec Objectif"}</p>
      <p>Montant Actuel : {envelope.amount} €</p>
      {envelope.type === "objectif" && envelope.goalAmount && (
        <div>
          <p>Objectif : {envelope.goalAmount} €</p>
          <ProgressBar progress={envelope.progress} />
        </div>
      )}
      <form onSubmit={handleAddAmount}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ajouter/Retirer (€)"
          required
        />
        <button type="submit">Mettre à jour</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button
        onClick={() => onDelete(envelope._id)}
        style={{ marginTop: "10px", backgroundColor: "#dc3545" }}
      >
        Supprimer
      </button>
    </li>
  );
};

export default EnvelopeItem;
