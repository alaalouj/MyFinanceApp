// client/src/components/Expenses/Expenses.jsx

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateExpenseForm from "./CreateExpenseForm";
import ExpenseItem from "./ExpenseItem";

const Expenses = () => {
  const { expenses, createExpense, updateExpense, deleteExpense, accounts } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        <ul style={styles.list}>
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onUpdate={handleUpdateExpense}
              onDelete={handleDeleteExpense}
              accounts={accounts}
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

export default Expenses;
