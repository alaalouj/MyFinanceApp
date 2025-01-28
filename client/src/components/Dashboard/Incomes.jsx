// client/src/components/Dashboard/Incomes.jsx

import React, { useState, useEffect } from "react";
import API from "../../services/api";

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  // Récupérer les revenus au chargement du composant
  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const { data } = await API.get("/incomes");
      setIncomes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await API.post("/incomes", { amount, source });
      fetchIncomes();
      setAmount("");
      setSource("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'ajout du revenu."
      );
    }
  };

  return (
    <div>
      <h3>Revenus</h3>
      <form onSubmit={handleAddIncome}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant (€)"
          required
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source (Salaire, Freelance, etc.)"
          required
        />
        <button type="submit">Ajouter</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <ul>
        {incomes.map((inc) => (
          <li key={inc._id}>
            {new Date(inc.date).toLocaleDateString()} - {inc.amount} € -{" "}
            {inc.source}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Incomes;
