// client/src/components/Envelopes/EnvelopeItem.jsx

import React, { useState } from "react";
import ProgressBar from "../UI/ProgressBar";

const EnvelopeItem = ({
  envelope,
  onUpdate,
  onDelete,
  onAddMilestone,
  onDeleteMilestone,
}) => {
  const [amount, setAmount] = useState("");
  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
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

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (milestoneName.trim() === "" || milestoneAmount === "") {
      setError("Veuillez entrer un nom et un montant pour l'échelon.");
      return;
    }
    const milestoneData = {
      name: milestoneName,
      amount: parseFloat(milestoneAmount),
    };
    onAddMilestone(envelope._id, milestoneData);
    setMilestoneName("");
    setMilestoneAmount("");
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
          <h5>Échelons/Seuils :</h5>
          <ul>
            {envelope.milestones.map((milestone) => (
              <li
                key={milestone._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {milestone.name} : {milestone.amount} €{" "}
                  {milestone.achieved ? "(Atteint)" : ""}
                </span>
                <button
                  onClick={() => onDeleteMilestone(envelope._id, milestone._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "0.3rem 0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddMilestone} style={{ marginTop: "0.5rem" }}>
            <input
              type="text"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Nom de l'échelon"
              required
              style={{ marginRight: "0.5rem" }}
            />
            <input
              type="number"
              value={milestoneAmount}
              onChange={(e) => setMilestoneAmount(e.target.value)}
              placeholder="Montant (€)"
              required
              style={{ marginRight: "0.5rem" }}
            />
            <button type="submit">Ajouter Échelon</button>
          </form>
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
