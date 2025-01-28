// client/src/pages/DashboardPage.jsx

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EnvelopeItem from "../components/Envelopes/EnvelopeItem";

const DashboardPage = () => {
  const { totalBalance, totalAllocated, availableMoney, accounts, envelopes } =
    useContext(AuthContext);

  // Définir des fonctions vides pour éviter les erreurs et empêcher les modifications
  const handleUpdateEnvelope = () => {};
  const handleDeleteEnvelope = () => {};
  const handleAddMilestone = () => {};
  const handleDeleteMilestone = () => {};
  const handleUpdateMilestone = () => {};

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <div style={styles.summary}>
        <div style={styles.card}>
          <h4>Total des Comptes</h4>
          <p>{totalBalance} €</p>
        </div>
        <div style={styles.card}>
          <h4>Total Alloué aux Enveloppes</h4>
          <p>{totalAllocated} €</p>
        </div>
        <div style={styles.card}>
          <h4>Argent Disponible</h4>
          <p>{availableMoney} €</p>
        </div>
      </div>

      <h3>Comptes</h3>
      {accounts.length === 0 ? (
        <p>Aucun compte enregistré.</p>
      ) : (
        <ul style={styles.list}>
          {accounts.map((account) => (
            <li key={account._id} style={styles.listItem}>
              {account.name} (
              {account.type === "compte" ? "Compte Bancaire" : "Portefeuille"})
              - {account.balance} €
            </li>
          ))}
        </ul>
      )}

      <h3>Enveloppes Budgétaires</h3>
      {envelopes.length === 0 ? (
        <p>Aucune enveloppe enregistrée.</p>
      ) : (
        <ul style={styles.list}>
          {envelopes.map((envelope) => (
            <EnvelopeItem
              key={envelope._id}
              envelope={envelope}
              onUpdate={handleUpdateEnvelope} // Fonction vide
              onDelete={handleDeleteEnvelope} // Fonction vide
              onAddMilestone={handleAddMilestone} // Fonction vide
              onDeleteMilestone={handleDeleteMilestone} // Fonction vide
              onUpdateMilestone={handleUpdateMilestone} // Fonction vide
              disableExpand={true} // Désactiver l'expansion
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  summary: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "1rem",
    width: "30%",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
  listItem: {
    marginBottom: "0.5rem",
  },
};

export default DashboardPage;
