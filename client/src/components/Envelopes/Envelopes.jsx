// client/src/components/Envelopes/Envelopes.jsx

import React, { useState, useEffect } from "react";
import API from "../../services/api";
import EnvelopeItem from "./EnvelopeItem";
import CreateEnvelopeForm from "./CreateEnvelopeForm";

const Envelopes = () => {
  const [envelopes, setEnvelopes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnvelopes();
  }, []);

  const fetchEnvelopes = async () => {
    try {
      const { data } = await API.get("/envelopes");
      setEnvelopes(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des enveloppes.");
    }
  };

  const handleAddEnvelope = async (envelope) => {
    try {
      const { data } = await API.post("/envelopes", envelope);
      setEnvelopes([...envelopes, data]);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de l'enveloppe.");
    }
  };

  const handleUpdateEnvelope = async (envelopeId, amount) => {
    try {
      const { data } = await API.put(`/envelopes/${envelopeId}`, { amount });
      setEnvelopes(
        envelopes.map((env) => (env._id === envelopeId ? data : env))
      );
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de l'enveloppe.");
    }
  };

  const handleDeleteEnvelope = async (envelopeId) => {
    try {
      await API.delete(`/envelopes/${envelopeId}`);
      setEnvelopes(envelopes.filter((env) => env._id !== envelopeId));
      setError("");
    } catch (err) {
      console.error(err);
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
          />
        ))}
      </ul>
    </div>
  );
};

export default Envelopes;
