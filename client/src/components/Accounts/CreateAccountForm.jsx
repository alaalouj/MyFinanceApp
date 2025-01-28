// client/src/components/Accounts/CreateAccountForm.jsx

import React, { useState } from "react";

const CreateAccountForm = ({ onAddAccount }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("compte");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setError("Veuillez entrer un nom de compte.");
      return;
    }
    if (balance === "" || parseFloat(balance) < 0) {
      setError("Veuillez entrer un solde initial valide.");
      return;
    }

    const accountData = {
      name,
      type,
      balance: parseFloat(balance),
    };

    onAddAccount(accountData);
    setName("");
    setType("compte");
    setBalance("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h4>Créer un nouveau compte ou portefeuille</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du compte/portefeuille"
        required
        style={{ marginRight: "0.5rem" }}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      >
        <option value="compte">Compte Bancaire</option>
        <option value="portefeuille">Portefeuille</option>
      </select>
      <input
        type="number"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        placeholder="Solde initial (€)"
        required
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit">Créer</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateAccountForm;
