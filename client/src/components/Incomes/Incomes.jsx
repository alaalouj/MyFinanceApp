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

  // Fonction pour grouper les revenus par date (YYYY-MM-DD) et calculer le total
  const groupIncomesByDate = (incomes) => {
    return incomes.reduce((groups, income) => {
      const date = new Date(income.date);
      const dateKey = date.toISOString().split("T")[0]; // Format: "2023-09-01"

      if (!groups[dateKey]) {
        groups[dateKey] = {
          total: 0,
          incomes: [],
        };
      }
      groups[dateKey].incomes.push(income);
      groups[dateKey].total += income.amount;
      return groups;
    }, {});
  };

  if (loading) {
    return <div>Chargement des revenus...</div>;
  }

  // Trier les revenus par date décroissante si ce n'est pas déjà fait dans le backend
  const sortedIncomes = [...incomes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const groupedIncomes = groupIncomesByDate(sortedIncomes);

  // Obtenir les clés de dates triées du plus récent au plus ancien
  const sortedDateKeys = Object.keys(groupedIncomes).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div>
      <h3>Revenus</h3>
      <CreateIncomeForm onAddIncome={handleAddIncome} accounts={accounts} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {incomes.length === 0 ? (
        <p>Aucun revenu enregistré.</p>
      ) : (
        <div>
          {sortedDateKeys.map((dateKey) => {
            const { total, incomes } = groupedIncomes[dateKey];

            return (
              <div key={dateKey} style={styles.dateGroup}>
                <div style={styles.dateHeader}>
                  <h4 style={styles.dateText}>{formatDate(dateKey)}</h4>
                  <h4 style={styles.totalText}>{total} €</h4>
                </div>
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
    color: "#28a745", // Vert pour le total, ajustez selon vos préférences
    fontWeight: "bold",
  },
};

export default Incomes;
