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

  // Fonction pour formater la date en "Jour Mois Année" (ex: Lundi 1 Septembre 2023)
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Fonction pour grouper les dépenses par date (YYYY-MM-DD)
  const groupExpensesByDate = (expenses) => {
    return expenses.reduce((groups, expense) => {
      const date = new Date(expense.date);
      const dateKey = date.toISOString().split("T")[0]; // Format: "2023-09-01"

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
      return groups;
    }, {});
  };

  // Fonction pour calculer le total des dépenses pour un groupe donné
  const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return <div>Chargement des dépenses...</div>;
  }

  // Trier les dépenses par date décroissante si ce n'est pas déjà fait dans le backend
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const groupedExpenses = groupExpensesByDate(sortedExpenses);

  // Obtenir les clés de dates triées du plus récent au plus ancien
  const sortedDateKeys = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div>
      <h3>Dépenses</h3>
      <CreateExpenseForm onAddExpense={handleAddExpense} accounts={accounts} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {expenses.length === 0 ? (
        <p>Aucune dépense enregistrée.</p>
      ) : (
        <div>
          {sortedDateKeys.map((dateKey) => {
            const total = calculateTotal(groupedExpenses[dateKey]);

            return (
              <div key={dateKey} style={styles.dateGroup}>
                <div style={styles.dateHeader}>
                  <h4 style={styles.dateText}>{formatDate(dateKey)}</h4>
                  <h4 style={styles.totalText}>{total} €</h4>
                </div>
                <ul style={styles.list}>
                  {groupedExpenses[dateKey].map((expense) => (
                    <ExpenseItem
                      key={expense._id}
                      expense={expense}
                      onUpdate={handleUpdateExpense}
                      onDelete={handleDeleteExpense}
                      accounts={accounts}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
  dateGroup: {
    marginBottom: "2rem",
  },
  dateHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  },
  dateText: {
    textTransform: "capitalize",
  },
  totalText: {
    color: "#BB0B0B", // Vert pour le total, ajustez selon vos préférences
    fontWeight: "bold",
  },
};

export default Expenses;
