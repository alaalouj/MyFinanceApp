// client/src/components/Expenses/Expenses.jsx

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateExpenseForm from "./CreateExpenseForm";
import EditExpenseForm from "./EditExpenseForm"; // Nouveau composant pour l'édition

const Expenses = () => {
  const { expenses, createExpense, updateExpense, deleteExpense, accounts } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null); // Dépense en cours d'édition

  // Mettre à jour l'état de chargement une fois les dépenses chargées
  useEffect(() => {
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
      setEditingExpense(null); // Fermer le formulaire d'édition
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
      {expenses.length === 0 ? (
        <p>Aucune dépense enregistrée.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {expenses.map((expense) => (
            <li
              key={expense._id}
              style={{
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
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
              {/* Boutons pour modifier et supprimer */}
              <button
                onClick={() => setEditingExpense(expense)}
                style={{ marginRight: "0.5rem" }}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteExpense(expense._id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "0.3rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>

              {/* Formulaire d'édition */}
              {editingExpense && editingExpense._id === expense._id && (
                <EditExpenseForm
                  expense={editingExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onCancel={() => setEditingExpense(null)}
                  accounts={accounts}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Expenses;
