// client/src/components/Incomes/IncomeItem.jsx

import React, { useState } from "react";
import EditIncomeForm from "./EditIncomeForm";

const IncomeItem = ({ income, onUpdate, onDelete, accounts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState("");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Fermer le formulaire d'édition si l'élément est réduit
    if (isExpanded) {
      setIsEditing(false);
    }
  };

  // Fonction pour gérer la mise à jour et fermer le formulaire en cas de succès
  const handleUpdate = async (incomeId, updatedData) => {
    try {
      await onUpdate(incomeId, updatedData);
      setIsEditing(false);
      setLocalError("");
    } catch (err) {
      setLocalError("Erreur lors de la mise à jour du revenu.");
    }
  };

  return (
    <li style={styles.item}>
      <div onClick={toggleExpand} style={styles.summary}>
        <span>{income.description}</span>
        <span>
          {income.amount.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          €
        </span>
      </div>
      {isExpanded && (
        <div style={styles.details}>
          {!isEditing ? (
            <>
              <p>
                <strong>Compte :</strong>{" "}
                {income.account
                  ? `${income.account.name} (${
                      income.account.type === "compte"
                        ? "Compte Bancaire"
                        : "Portefeuille"
                    })`
                  : "N/A"}
              </p>
              <p>
                <strong>Catégorie :</strong> {income.category}
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {new Date(income.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <button onClick={() => setIsEditing(true)} style={styles.button}>
                Modifier
              </button>
              <button
                onClick={() => onDelete(income._id)}
                style={{ ...styles.button, ...styles.deleteButton }}
              >
                Supprimer
              </button>
              {localError && <p style={{ color: "red" }}>{localError}</p>}
            </>
          ) : (
            <EditIncomeForm
              income={income}
              onUpdateIncome={handleUpdate}
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

export default IncomeItem;
