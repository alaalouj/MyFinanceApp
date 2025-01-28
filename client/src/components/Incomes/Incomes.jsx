// client/src/components/Incomes/Incomes.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateIncomeForm from "./CreateIncomeForm";

const Incomes = () => {
  const { incomes, createIncome, updateIncome, deleteIncome, accounts } =
    useContext(AuthContext);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h3>Revenus</h3>
      <CreateIncomeForm onAddIncome={handleAddIncome} accounts={accounts} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {incomes.map((income) => (
          <li key={income._id} style={{ marginBottom: "1rem" }}>
            <h4>{income.description}</h4>
            <p>
              Compte : {income.account ? income.account.name : "Compte inconnu"}{" "}
              (
              {income.account
                ? income.account.type === "compte"
                  ? "Compte Bancaire"
                  : "Portefeuille"
                : "N/A"}
              )
            </p>
            <p>Catégorie : {income.category}</p>
            <p>Montant : {income.amount} €</p>
            <p>Date : {new Date(income.date).toLocaleDateString()}</p>
            {/* Ajoutez ici des boutons ou formulaires pour mettre à jour ou supprimer le revenu */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Incomes;
