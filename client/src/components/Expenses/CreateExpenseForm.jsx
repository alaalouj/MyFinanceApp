// client/src/components/Expenses/CreateExpenseForm.jsx

import React, { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES } from "../../constants/categories";

const CreateExpenseForm = ({ onAddExpense, accounts }) => {
  // Initialiser la date à aujourd'hui au format 'YYYY-MM-DD'
  const today = new Date().toISOString().split("T")[0];

  const [accountId, setAccountId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  // Définir la catégorie par défaut à "Divers"
  const [category, setCategory] = useState("Divers");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");

  // Utiliser useEffect pour sélectionner le premier compte par défaut
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setAccountId(accounts[0]._id);
    }
  }, [accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remplacer les virgules par des points pour le parsing
    const parsedAmount = parseFloat(amount.replace(",", "."));

    if (!accountId) {
      setError("Veuillez sélectionner un compte.");
      return;
    }
    if (description.trim() === "") {
      setError("Veuillez entrer une description.");
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }
    if (category.trim() === "") {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    const expenseData = {
      accountId,
      description,
      amount: parsedAmount,
      category,
      date: date || undefined,
    };

    try {
      await onAddExpense(expenseData);
      // Réinitialiser les champs après soumission réussie
      setDescription("");
      setAmount("");
      setCategory("Divers");
      setDate(today);
      setError("");
      // Re-sélectionner le premier compte par défaut si nécessaire
      if (accounts && accounts.length > 0) {
        setAccountId(accounts[0]._id);
      }
    } catch (err) {
      setError("Erreur lors de la création de la dépense.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4>Ajouter une dépense</h4>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
        style={styles.select}
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
        style={styles.input}
      />
      <input
        type="text" // Utiliser type="text" pour permettre la virgule
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant (€)"
        required
        style={styles.input}
        pattern="^\d+(,\d{1,2})?$" // Validation HTML pour chiffres avec virgule
        title="Veuillez entrer un montant valide (ex : 12,34 ou 12.34)"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        style={styles.select}
      >
        <option value="">Sélectionner une catégorie</option>
        {EXPENSE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Ajouter
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const styles = {
  form: {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
  },
  select: {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "3px",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
};

export default CreateExpenseForm;
