// client/src/components/Incomes/Incomes.jsx

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateIncomeForm from "./CreateIncomeForm";
import IncomeItem from "./IncomeItem";

const Incomes = () => {
  const { incomes, createIncome, updateIncome, deleteIncome, accounts } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        <ul style={styles.list}>
          {incomes.map((income) => (
            <IncomeItem
              key={income._id}
              income={income}
              onUpdate={handleUpdateIncome}
              onDelete={handleDeleteIncome}
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

export default Incomes;
