// client/src/components/Accounts/Accounts.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateAccountForm from "./CreateAccountForm";

const Accounts = () => {
  const {
    accounts,
    createAccount,
    updateAccount,
    deleteAccount,
    totalBalance,
  } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleAddAccount = async (accountData) => {
    try {
      await createAccount(accountData);
      setError("");
    } catch (err) {
      setError("Erreur lors de la création du compte.");
    }
  };

  const handleUpdateAccount = async (accountId, amount) => {
    try {
      await updateAccount(accountId, amount);
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour du compte.");
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await deleteAccount(accountId);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression du compte.");
    }
  };

  return (
    <div>
      <h3>Comptes et Portefeuilles</h3>
      <p>
        <strong>Somme Totale Actuelle :</strong> {totalBalance} €
      </p>
      <CreateAccountForm onAddAccount={handleAddAccount} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {accounts.map((account) => (
          <li key={account._id} style={{ marginBottom: "1rem" }}>
            <h4>
              {account.name} (
              {account.type === "compte" ? "Compte Bancaire" : "Portefeuille"})
            </h4>
            <p>Solde : {account.balance} €</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.amount.value);
                handleUpdateAccount(account._id, amount);
                e.target.amount.value = "";
              }}
            >
              <input
                type="number"
                name="amount"
                placeholder="Ajouter/Retirer (€)"
                required
              />
              <button type="submit">Mettre à jour</button>
            </form>
            <button
              onClick={() => handleDeleteAccount(account._id)}
              style={{
                marginTop: "0.5rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "0.5rem",
                cursor: "pointer",
              }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accounts;
