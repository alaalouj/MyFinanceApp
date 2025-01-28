// client/src/components/Envelopes/Envelopes.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import EnvelopeItem from "./EnvelopeItem";
import CreateEnvelopeForm from "./CreateEnvelopeForm";

const Envelopes = () => {
  const {
    envelopes,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
    addMilestone,
    deleteMilestone,
  } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleAddEnvelope = async (envelopeData) => {
    try {
      await createEnvelope(envelopeData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la création de l'enveloppe.");
    }
  };

  const handleAddMilestone = async (envelopeId, milestoneData) => {
    try {
      await addMilestone(envelopeId, milestoneData);
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout de l'échelon.");
    }
  };

  const handleDeleteMilestone = async (envelopeId, milestoneId) => {
    try {
      await deleteMilestone(envelopeId, milestoneId);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression de l'échelon.");
    }
  };

  const handleUpdateEnvelope = async (envelopeId, amount) => {
    try {
      await updateEnvelope(envelopeId, amount);
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'enveloppe.");
    }
  };

  const handleDeleteEnvelope = async (envelopeId) => {
    try {
      await deleteEnvelope(envelopeId);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression de l'enveloppe.");
    }
  };

  return (
    <div>
      <h3>Enveloppes Budgétaires</h3>
      <CreateEnvelopeForm onAddEnvelope={handleAddEnvelope} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {envelopes.map((envelope) => (
          <EnvelopeItem
            key={envelope._id}
            envelope={envelope}
            onUpdate={handleUpdateEnvelope}
            onDelete={handleDeleteEnvelope}
            onAddMilestone={handleAddMilestone}
            onDeleteMilestone={handleDeleteMilestone}
          />
        ))}
      </ul>
    </div>
  );
};

export default Envelopes;
