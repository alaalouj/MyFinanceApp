// client/src/components/Expenses/EditExpenseForm.jsx

import React, { useState } from "react";

const EditExpenseForm = ({ expense, onUpdateExpense, onCancel, accounts }) => {
  const [accountId, setAccountId] = useState(
    expense.account ? expense.account._id : ""
  );
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(
    expense.date ? expense.date.substring(0, 10) : ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountId) {
      setError("Veuillez sélectionner un compte.");
      return;
    }
    if (description.trim() === "") {
      setError("Veuillez entrer une description.");
      return;
    }
    if (amount === "" || parseFloat(amount) <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }
    if (category.trim() === "") {
      setError("Veuillez entrer une catégorie.");
      return;
    }

    const updatedExpenseData = {
      accountId,
      description,
      amount: parseFloat(amount),
      category,
      date: date || undefined,
    };

    onUpdateExpense(expense._id, updatedExpenseData);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h4>Modifier la dépense</h4>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
        style={{ marginRight: "0.5rem" }}
      >
        <option value="">Sélectionner un compte</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.name} (
            {account.type === "compte" ? "Compte Bancaire" : "Portefeuille"})
          </option>
        ))}
      </select>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
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
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Catégorie"
        required
        style={{ marginRight: "0.5rem" }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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

export default EditExpenseForm;
