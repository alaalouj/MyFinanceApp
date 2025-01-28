// client/src/components/Envelopes/Envelopes.jsx

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateEnvelopeForm from "./CreateEnvelopeForm";
import EnvelopeItem from "./EnvelopeItem";

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
  const [loading, setLoading] = useState(true);

  // Mettre à jour l'état de chargement une fois les enveloppes chargées
  useEffect(() => {
    if (envelopes) {
      setLoading(false);
    }
  }, [envelopes]);

  const handleAddEnvelope = async (envelopeData) => {
    try {
      await createEnvelope(envelopeData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la création de l'enveloppe.");
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

  const handleAddMilestone = async (envelopeId, milestoneData) => {
    try {
      await addMilestone(envelopeId, milestoneData);
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout du seuil.");
    }
  };

  const handleDeleteMilestone = async (envelopeId, milestoneId) => {
    try {
      await deleteMilestone(envelopeId, milestoneId);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression du seuil.");
    }
  };

  if (loading) {
    return <div>Chargement des enveloppes...</div>;
  }

  return (
    <div>
      <h3>Enveloppes Budgétaires</h3>
      <CreateEnvelopeForm onAddEnvelope={handleAddEnvelope} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {envelopes.length === 0 ? (
        <p>Aucune enveloppe enregistrée.</p>
      ) : (
        <ul style={styles.list}>
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
      )}
    </div>
  );
};

const styles = {
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
};

export default Envelopes;
