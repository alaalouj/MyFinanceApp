// client/src/components/Expenses/Expenses.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateExpenseForm from "./CreateExpenseForm";

const Expenses = () => {
  const { expenses, createExpense, updateExpense, deleteExpense, accounts } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Assurez-vous que l'état loading est mis à jour après la récupération des données
  React.useEffect(() => {
    if (expenses) {
      setLoading(false);
    }
  }, [expenses]);

  const handleAddExpense = async (expenseData) => {
    try {
      await createExpense(expenseData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la création de la dépense.");
    }
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    try {
      await updateExpense(expenseId, expenseData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour de la dépense.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression de la dépense.");
    }
  };

  if (loading) {
    return <div>Chargement des dépenses...</div>;
  }

  return (
    <div>
      <h3>Dépenses</h3>
      <CreateExpenseForm onAddExpense={handleAddExpense} accounts={accounts} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id} style={{ marginBottom: "1rem" }}>
            <h4>{expense.description}</h4>
            <p>
              Compte :{" "}
              {expense.account ? (
                <>
                  {expense.account.name} (
                  {expense.account.type === "compte"
                    ? "Compte Bancaire"
                    : "Portefeuille"}
                  )
                </>
              ) : (
                "Compte inconnu (N/A)"
              )}
            </p>
            <p>Catégorie : {expense.category}</p>
            <p>Montant : {expense.amount} €</p>
            <p>Date : {new Date(expense.date).toLocaleDateString()}</p>
            {/* Ajoutez ici des boutons ou formulaires pour mettre à jour ou supprimer la dépense */}
            <button onClick={() => handleDeleteExpense(expense._id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;
