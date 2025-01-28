// client/src/components/Expenses/ExpenseItem.jsx

import React, { useState } from "react";
import EditExpenseForm from "./EditExpenseForm";

const ExpenseItem = ({ expense, onUpdate, onDelete, accounts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Fermer le formulaire d'édition si l'élément est réduit
    if (isExpanded) {
      setIsEditing(false);
    }
  };

  return (
    <li style={styles.item}>
      <div onClick={toggleExpand} style={styles.summary}>
        <span>{expense.description}</span>
        <span>{expense.amount} €</span>
      </div>
      {isExpanded && (
        <div style={styles.details}>
          {!isEditing ? (
            <>
              <p>
                <strong>Compte :</strong>{" "}
                {expense.account
                  ? `${expense.account.name} (${
                      expense.account.type === "compte"
                        ? "Compte Bancaire"
                        : "Portefeuille"
                    })`
                  : "N/A"}
              </p>
              <p>
                <strong>Catégorie :</strong> {expense.category}
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {new Date(expense.date).toLocaleDateString()}
              </p>
              <button onClick={() => setIsEditing(true)} style={styles.button}>
                Modifier
              </button>
              <button
                onClick={() => onDelete(expense._id)}
                style={{ ...styles.button, ...styles.deleteButton }}
              >
                Supprimer
              </button>
            </>
          ) : (
            <EditExpenseForm
              expense={expense}
              onUpdate={onUpdate}
              onCancel={() => setIsEditing(false)}
              accounts={accounts}
            />
          )}
        </div>
      )}
    </li>
  );
};

const styles = {
  item: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "0.5rem",
    padding: "0.5rem",
    listStyle: "none",
    cursor: "pointer",
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    marginTop: "0.5rem",
    paddingLeft: "1rem",
  },
  button: {
    marginRight: "0.5rem",
    padding: "0.3rem 0.5rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "3px",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
};

export default ExpenseItem;
