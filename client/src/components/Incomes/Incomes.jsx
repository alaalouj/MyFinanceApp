// client/src/components/Incomes/Incomes.jsx

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateIncomeForm from "./CreateIncomeForm";
import EditIncomeForm from "./EditIncomeForm"; // Nouveau composant pour l'édition

const Incomes = () => {
  const { incomes, createIncome, updateIncome, deleteIncome, accounts } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingIncome, setEditingIncome] = useState(null); // Revenu en cours d'édition

  // Mettre à jour l'état de chargement une fois les revenus chargés
  useEffect(() => {
    if (incomes) {
      setLoading(false);
    }
  }, [incomes]);

  const handleAddIncome = async (incomeData) => {
    try {
      await createIncome(incomeData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la création du revenu.");
    }
  };

  const handleUpdateIncome = async (incomeId, incomeData) => {
    try {
      await updateIncome(incomeId, incomeData);
      setEditingIncome(null); // Fermer le formulaire d'édition
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour du revenu.");
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      await deleteIncome(incomeId);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression du revenu.");
    }
  };

  if (loading) {
    return <div>Chargement des revenus...</div>;
  }

  return (
    <div>
      <h3>Revenus</h3>
      <CreateIncomeForm onAddIncome={handleAddIncome} accounts={accounts} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {incomes.length === 0 ? (
        <p>Aucun revenu enregistré.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {incomes.map((income) => (
            <li
              key={income._id}
              style={{
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
              <h4>{income.description}</h4>
              <p>
                Compte :{" "}
                {income.account ? (
                  <>
                    {income.account.name} (
                    {income.account.type === "compte"
                      ? "Compte Bancaire"
                      : "Portefeuille"}
                    )
                  </>
                ) : (
                  "Compte inconnu (N/A)"
                )}
              </p>
              <p>Catégorie : {income.category}</p>
              <p>Montant : {income.amount} €</p>
              <p>Date : {new Date(income.date).toLocaleDateString()}</p>
              {/* Boutons pour modifier et supprimer */}
              <button
                onClick={() => setEditingIncome(income)}
                style={{ marginRight: "0.5rem" }}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteIncome(income._id)}
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
              {editingIncome && editingIncome._id === income._id && (
                <EditIncomeForm
                  income={editingIncome}
                  onUpdateIncome={handleUpdateIncome}
                  onCancel={() => setEditingIncome(null)}
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

export default Incomes;
