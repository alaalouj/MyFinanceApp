// client/src/components/Envelopes/EnvelopeItem.jsx

import React, { useState, useEffect, useContext } from "react";
import ProgressBar from "../UI/ProgressBar";
import EditMilestoneForm from "./EditMilestoneForm";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api"; // Assurez-vous d'importer l'API pour les mises à jour des milestones

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
  const [editingMilestone, setEditingMilestone] = useState(null); // Seuil en cours d'édition
  const { updateMilestone } = useContext(AuthContext);

  useEffect(() => {
    setEditingMilestone(null);
  }, [envelope.amount, envelope.milestones]);

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

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (milestoneName.trim() === "" || milestoneAmount === "") {
      setError("Veuillez entrer un nom et un montant pour le seuil.");
      return;
    }
    const milestoneData = {
      name: milestoneName,
      amount: parseFloat(milestoneAmount),
    };
    try {
      await onAddMilestone(envelope._id, milestoneData);
      setMilestoneName("");
      setMilestoneAmount("");
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout du seuil.");
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce seuil ?")) {
      try {
        await onDeleteMilestone(envelope._id, milestoneId);
      } catch (err) {
        setError("Erreur lors de la suppression du seuil.");
      }
    }
  };

  const handleUpdateMilestone = async (milestoneId, updatedData) => {
    try {
      await updateMilestone(envelope._id, milestoneId, updatedData);
      setEditingMilestone(null); // Fermer le formulaire d'édition
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour du seuil.");
    }
  };

  // Calcul de la progression en pourcentage
  const calculateProgress = () => {
    if (envelope.type !== "objectif" || !envelope.goalAmount) return 0;
    return (envelope.amount / envelope.goalAmount) * 100;
  };

  const progress = calculateProgress();

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
          <ProgressBar
            progress={progress}
            milestones={envelope.milestones}
            goalAmount={envelope.goalAmount}
          />
          <p>Progression : {progress.toFixed(2)}%</p>
          <h5>Seuils/Milestones :</h5>
          {envelope.milestones.length === 0 ? (
            <p>Aucun seuil ajouté.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {envelope.milestones.map((milestone) => (
                <li
                  key={milestone._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span>
                    {milestone.name} : {milestone.amount} €{" "}
                    {milestone.achieved ? "(Atteint)" : ""}
                  </span>
                  <div>
                    <button
                      onClick={() => setEditingMilestone(milestone)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(milestone._id)}
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
                  </div>

                  {/* Formulaire d'édition du seuil */}
                  {editingMilestone &&
                    editingMilestone._id === milestone._id && (
                      <EditMilestoneForm
                        milestone={editingMilestone}
                        onUpdateMilestone={handleUpdateMilestone}
                        onCancel={() => setEditingMilestone(null)}
                      />
                    )}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleAddMilestone} style={{ marginTop: "0.5rem" }}>
            <input
              type="text"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Nom du seuil"
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
            <button type="submit">Ajouter Seuil</button>
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
