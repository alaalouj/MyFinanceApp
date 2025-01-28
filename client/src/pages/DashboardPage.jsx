// client/src/pages/DashboardPage.jsx

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const DashboardPage = () => {
  const { totalBalance, accounts, envelopes } = useContext(AuthContext);

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
        <ul>
          {accounts.map((account) => (
            <li key={account._id}>
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
        <ul>
          {envelopes.map((envelope) => (
            <li key={envelope._id}>
              {envelope.name} - {envelope.amount} €{" "}
              {envelope.type === "objectif" &&
                ` (Objectif: ${envelope.goalAmount} €)`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;
