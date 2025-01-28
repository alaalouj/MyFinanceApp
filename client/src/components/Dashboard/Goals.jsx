// client/src/components/Dashboard/Goals.jsx

import React, { useState, useEffect } from "react";
import API from "../../services/api";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");

  // Récupérer les objectifs au chargement du composant
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await API.get("/goals");
      setGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await API.post("/goals", { title, targetAmount, deadline });
      fetchGoals();
      setTitle("");
      setTargetAmount("");
      setDeadline("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Erreur lors de l'ajout de l'objectif."
      );
    }
  };

  const handleCalculateSaving = async (goalId) => {
    try {
      const { data } = await API.get(`/goals/${goalId}/advice`);
      setMessage(data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Erreur lors du calcul de l'épargne."
      );
    }
  };

  return (
    <div>
      <h3>Objectifs Financiers</h3>
      <form onSubmit={handleAddGoal}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'objectif (Ex: Voyage au Japon)"
          required
        />
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="Montant cible (€)"
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {goals.map((goal) => (
          <li key={goal._id}>
            <strong>{goal.title}</strong> - {goal.currentAmount} € /{" "}
            {goal.targetAmount} € - Échéance:{" "}
            {new Date(goal.deadline).toLocaleDateString()}
            <button onClick={() => handleCalculateSaving(goal._id)}>
              Calculer l'épargne mensuelle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;
