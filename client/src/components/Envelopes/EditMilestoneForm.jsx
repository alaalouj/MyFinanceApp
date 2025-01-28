// client/src/components/Envelopes/EditMilestoneForm.jsx

import React, { useState } from "react";

const EditMilestoneForm = ({ milestone, onUpdateMilestone, onCancel }) => {
  const [name, setName] = useState(milestone.name);
  const [amount, setAmount] = useState(milestone.amount);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "" || amount === "") {
      setError("Veuillez entrer un nom et un montant valide.");
      return;
    }

    const updatedData = {
      name,
      amount: parseFloat(amount),
    };

    onUpdateMilestone(milestone._id, updatedData);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "0.5rem",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h5>Modifier le seuil</h5>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du seuil"
        required
        style={{ marginRight: "0.5rem" }}
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant (€)"
        required
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit" style={{ marginRight: "0.5rem" }}>
        Mettre à jour
      </button>
      <button type="button" onClick={onCancel}>
        Annuler
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default EditMilestoneForm;
