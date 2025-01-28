// client/src/components/Savings/Savings.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Savings = () => {
  const { savings, updateSaving } = useContext(AuthContext);
  const [type, setType] = useState("compte");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleUpdateSaving = async (e) => {
    e.preventDefault();
    if (amount === "") {
      setError("Veuillez entrer un montant.");
      return;
    }
    try {
      await updateSaving(type, parseFloat(amount));
      setAmount("");
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'épargne.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Épargnes Actuelles</h3>
      <ul>
        {savings.map((saving) => (
          <li key={saving._id}>
            <strong>
              {saving.type === "compte" ? "Compte Bancaire" : "Espèces"}
            </strong>{" "}
            : {saving.amount} €
          </li>
        ))}
      </ul>
      <form onSubmit={handleUpdateSaving}>
        <h4>Mettre à jour une épargne</h4>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="compte">Compte Bancaire</option>
          <option value="espece">Espèces</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant (€)"
          required
        />
        <button type="submit">Mettre à jour</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Savings;
