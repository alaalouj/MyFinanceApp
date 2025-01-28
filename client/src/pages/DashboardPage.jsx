// client/src/pages/DashboardPage.jsx

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EnvelopeItem from "../components/Envelopes/EnvelopeItem";

const DashboardPage = () => {
  const { totalBalance, accounts, envelopes } = useContext(AuthContext);

  // Définir des fonctions vides pour éviter les erreurs
  const handleUpdateEnvelope = () => {};
  const handleDeleteEnvelope = () => {};
  const handleAddMilestone = () => {};
  const handleDeleteMilestone = () => {};
  const handleUpdateMilestone = () => {};

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <p>
        <strong>Solde Total:</strong> {totalBalance} €
      </p>

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
              disableExpand={true} // Nouveau prop pour désactiver l'expansion
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
  listItem: {
    marginBottom: "0.5rem",
  },
};

export default DashboardPage;
