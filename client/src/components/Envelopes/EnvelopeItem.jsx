// client/src/components/Envelopes/EnvelopeItem.jsx

import React, { useState } from "react";
import EditMilestoneForm from "./EditMilestoneForm";
import EditEnvelopeForm from "./EditEnvelopeForm";
import ProgressBar from "../UI/ProgressBar";

const EnvelopeItem = ({
  envelope,
  onUpdate,
  onDelete,
  onAddMilestone,
  onDeleteMilestone,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingEnvelope, setIsEditingEnvelope] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Fermer les formulaires d'édition si l'élément est réduit
    if (isExpanded) {
      setIsEditingEnvelope(false);
      setEditingMilestone(null);
    }
  };

  const handleUpdateEnvelope = (envelopeId, amount) => {
    onUpdate(envelopeId, amount);
  };

  const handleUpdateMilestone = (milestoneId, updatedData) => {
    onUpdateMilestone(envelope._id, milestoneId, updatedData);
  };

  return (
    <li style={styles.item}>
      <div onClick={toggleExpand} style={styles.summary}>
        <span>{envelope.name}</span>
        <span>{envelope.amount} €</span>
      </div>
      {isExpanded && (
        <div style={styles.details}>
          {!isEditingEnvelope ? (
            <>
              <p>
                <strong>Type :</strong>{" "}
                {envelope.type === "simple" ? "Simple" : "Avec Objectif"}
              </p>
              {envelope.type === "objectif" && envelope.goalAmount && (
                <>
                  <p>
                    <strong>Objectif :</strong> {envelope.goalAmount} €
                  </p>
                  <ProgressBar
                    progress={(envelope.amount / envelope.goalAmount) * 100}
                    milestones={envelope.milestones}
                    goalAmount={envelope.goalAmount}
                  />
                  <p>
                    <strong>Progression :</strong>{" "}
                    {((envelope.amount / envelope.goalAmount) * 100).toFixed(2)}
                    %
                  </p>
                </>
              )}
              <button
                onClick={() => setIsEditingEnvelope(true)}
                style={styles.button}
              >
                Modifier Enveloppe
              </button>
              <button
                onClick={() => onDelete(envelope._id)}
                style={{ ...styles.button, ...styles.deleteButton }}
              >
                Supprimer Enveloppe
              </button>

              {envelope.type === "objectif" && envelope.goalAmount && (
                <div style={{ marginTop: "1rem" }}>
                  <h5>Seuils/Milestones :</h5>
                  {envelope.milestones.length === 0 ? (
                    <p>Aucun seuil ajouté.</p>
                  ) : (
                    <ul style={styles.milestoneList}>
                      {envelope.milestones.map((milestone) => (
                        <li key={milestone._id} style={styles.milestoneItem}>
                          <span>
                            {milestone.name} : {milestone.amount} €{" "}
                            {milestone.achieved ? "(Atteint)" : ""}
                          </span>
                          <div>
                            <button
                              onClick={() => setEditingMilestone(milestone)}
                              style={styles.button}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() =>
                                onDeleteMilestone(envelope._id, milestone._id)
                              }
                              style={{
                                ...styles.button,
                                ...styles.deleteButton,
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
                  <AddMilestoneForm
                    onAddMilestone={onAddMilestone}
                    envelopeId={envelope._id}
                  />
                </div>
              )}
            </>
          ) : (
            <EditEnvelopeForm
              envelope={envelope}
              onUpdateEnvelope={handleUpdateEnvelope}
              onCancel={() => setIsEditingEnvelope(false)}
            />
          )}
        </div>
      )}
    </li>
  );
};

const AddMilestoneForm = ({ onAddMilestone, envelopeId }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (name.trim() === "" || amount === "") {
      setError("Veuillez entrer un nom et un montant pour le seuil.");
      return;
    }

    const milestoneData = {
      name,
      amount: parseFloat(amount),
    };

    try {
      await onAddMilestone(envelopeId, milestoneData);
      setName("");
      setAmount("");
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout du seuil.");
    }
  };

  return (
    <form onSubmit={handleAdd} style={styles.addMilestoneForm}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du seuil"
        required
        style={styles.input}
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant (€)"
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Ajouter Seuil
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const styles = {
  item: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "0.5rem",
    padding: "0.5rem",
    listStyle: "none",
    cursor: "pointer",
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    marginTop: "0.5rem",
    paddingLeft: "1rem",
  },
  button: {
    marginRight: "0.5rem",
    padding: "0.3rem 0.5rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "3px",
    backgroundColor: "#007bff",
    color: "#fff",
    marginTop: "0.5rem",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  milestoneList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  milestoneItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  addMilestoneForm: {
    marginTop: "1rem",
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginRight: "0.5rem",
    padding: "0.3rem",
    flex: "1",
  },
};

export default EnvelopeItem;
