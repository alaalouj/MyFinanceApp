// client/src/components/Incomes/EditIncomeForm.jsx

import React, { useState } from "react";
import { INCOME_CATEGORIES } from "../../constants/categories";

const EditIncomeForm = ({ income, onUpdateIncome, onCancel, accounts }) => {
  // Initialiser la date à la date du revenu ou aujourd'hui
  const initialDate = income.date
    ? income.date.substring(0, 10)
    : new Date().toISOString().split("T")[0];

  const [accountId, setAccountId] = useState(
    income.account ? income.account._id : ""
  );
  const [description, setDescription] = useState(income.description);
  const [amount, setAmount] = useState(
    income.amount.toString().replace(".", ",")
  );
  // Définir la catégorie par défaut à "Divers" si non spécifiée
  const [category, setCategory] = useState(income.category || "Divers");
  const [date, setDate] = useState(initialDate);
  const [error, setError] = useState("");

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

    const updatedIncomeData = {
      accountId,
      description,
      amount: parsedAmount,
      category,
      date: date || undefined,
    };

    try {
      await onUpdateIncome(income._id, updatedIncomeData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour du revenu.");
    }
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
      <h4>Modifier le revenu</h4>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
        style={{ marginRight: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
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
        style={{ marginRight: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
      />
      <input
        type="text" // Utiliser type="text" pour permettre la virgule
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant (€)"
        required
        style={{ marginRight: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
        pattern="^\d+(,\d{1,2})?$" // Validation HTML pour chiffres avec virgule
        title="Veuillez entrer un montant valide (ex : 12,34 ou 12.34)"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        style={{ marginRight: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
      >
        <option value="">Sélectionner une catégorie</option>
        {INCOME_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginRight: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
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

export default EditIncomeForm;
