// client/src/components/Layout/Navbar.jsx

import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, availableMoney } = useContext(AuthContext); // Modifié ici
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>
        Accueil
      </Link>
      {user && (
        <>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
          <Link to="/expenses" style={styles.link}>
            Dépenses
          </Link>
          <Link to="/incomes" style={styles.link}>
            Revenus
          </Link>
          <Link to="/envelopes" style={styles.link}>
            Enveloppes
          </Link>
          <Link to="/budget" style={styles.link}>
            Budget
          </Link>
          <span style={styles.balance}>Disponible: {availableMoney} €</span>{" "}
          {/* Modifié ici */}
          <button onClick={handleLogout} style={styles.button}>
            Déconnexion
          </button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login" style={styles.link}>
            Connexion
          </Link>
          <Link to="/register" style={styles.link}>
            Inscription
          </Link>
        </>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    alignItems: "center",
  },
  link: {
    marginRight: "1rem",
    textDecoration: "none",
    fontWeight: "bold",
    color: "#000",
  },
  balance: {
    marginRight: "1rem",
    fontWeight: "bold",
  },
  button: {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "3px",
    backgroundColor: "#dc3545",
    color: "#fff",
  },
};

export default Navbar;
