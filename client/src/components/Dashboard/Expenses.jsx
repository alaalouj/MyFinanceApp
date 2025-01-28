// client/src/components/Dashboard/Expenses.jsx

import React, { useState, useEffect } from "react";
import API from "../../services/api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Autre");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Récupérer les dépenses au chargement du composant
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/expenses");
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", { amount, category, description });
      fetchExpenses();
      setAmount("");
      setCategory("Autre");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'ajout de la dépense."
      );
    }
  };

  return (
    <div>
      <h3>Dépenses</h3>
      <form onSubmit={handleAddExpense}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant (€)"
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Loyer">Loyer</option>
          <option value="Nourriture">Nourriture</option>
          <option value="Loisirs">Loisirs</option>
          <option value="Transport">Transport</option>
          <option value="Autre">Autre</option>
        </select>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Ajouter</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <ul>
        {expenses.map((exp) => (
          <li key={exp._id}>
            {new Date(exp.date).toLocaleDateString()} - {exp.amount} € -{" "}
            {exp.category} ({exp.description})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;
