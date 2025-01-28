// client/src/components/Budget/BudgetForm.jsx

import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const BudgetForm = () => {
  const { createBudget } = useContext(AuthContext);
  const [budget, setBudget] = useState({
    loyer: "",
    salle: "",
    netflix: "",
    spotify: "",
    operateurTel: "",
    chatGPT: "",
    sogessur: "",
    transport: "",
    laverie: "",
    coiffeur: "",
    alimentation: "",
    sorties: "",
    vestimentaire: "",
    sante: "",
    technologique: "",
    cadeaux: "",
    divers: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setBudget({
      ...budget,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    const values = Object.values(budget).map((val) => parseFloat(val) || 0);
    return values.reduce((acc, curr) => acc + curr, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Préparer les données
    const budgetData = {
      ...budget,
      total: calculateTotal(),
    };

    try {
      await createBudget(budgetData);
      setSuccess("Budget créé avec succès.");
      setError("");
      // Réinitialiser le formulaire
      setBudget({
        loyer: "",
        salle: "",
        netflix: "",
        spotify: "",
        operateurTel: "",
        chatGPT: "",
        sogessur: "",
        transport: "",
        laverie: "",
        coiffeur: "",
        alimentation: "",
        sorties: "",
        vestimentaire: "",
        sante: "",
        technologique: "",
        cadeaux: "",
        divers: "",
      });
    } catch (err) {
      setError("Erreur lors de la création du budget.");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Créer un Budget</h3>
      <div style={styles.formGroup}>
        <label> Loyer: </label>
        <input
          type="number"
          name="loyer"
          value={budget.loyer}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Salle: </label>
        <input
          type="number"
          name="salle"
          value={budget.salle}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Netflix: </label>
        <input
          type="number"
          name="netflix"
          value={budget.netflix}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Spotify: </label>
        <input
          type="number"
          name="spotify"
          value={budget.spotify}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Opérateur Téléphonique: </label>
        <input
          type="number"
          name="operateurTel"
          value={budget.operateurTel}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> ChatGPT: </label>
        <input
          type="number"
          name="chatGPT"
          value={budget.chatGPT}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Sogessur: </label>
        <input
          type="number"
          name="sogessur"
          value={budget.sogessur}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Transport: </label>
        <input
          type="number"
          name="transport"
          value={budget.transport}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Laverie: </label>
        <input
          type="number"
          name="laverie"
          value={budget.laverie}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Coiffeur: </label>
        <input
          type="number"
          name="coiffeur"
          value={budget.coiffeur}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Alimentation et Besoins Domestiques: </label>
        <input
          type="number"
          name="alimentation"
          value={budget.alimentation}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Sorties et Loisirs: </label>
        <input
          type="number"
          name="sorties"
          value={budget.sorties}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Vestimentaire: </label>
        <input
          type="number"
          name="vestimentaire"
          value={budget.vestimentaire}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Santé: </label>
        <input
          type="number"
          name="sante"
          value={budget.sante}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Technologique & Informatique: </label>
        <input
          type="number"
          name="technologique"
          value={budget.technologique}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Cadeaux: </label>
        <input
          type="number"
          name="cadeaux"
          value={budget.cadeaux}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label> Divers: </label>
        <input
          type="number"
          name="divers"
          value={budget.divers}
          onChange={handleChange}
          placeholder="Montant (€)"
          min="0"
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>
          <strong>Total:</strong>
        </label>
        <input
          type="number"
          value={calculateTotal()}
          readOnly
          style={{ ...styles.input, backgroundColor: "#e9ecef" }}
        />
      </div>

      <button type="submit" style={styles.submitButton}>
        Créer Budget
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default BudgetForm;
