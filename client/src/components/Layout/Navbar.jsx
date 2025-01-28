// client/src/components/Layout/Navbar.jsx

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, totalBalance } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <Link
        to="/"
        style={{
          marginRight: "1rem",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Accueil
      </Link>
      {user && (
        <>
          <Link
            to="/dashboard"
            style={{ marginRight: "1rem", textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <Link
            to="/expenses"
            style={{ marginRight: "1rem", textDecoration: "none" }}
          >
            Dépenses
          </Link>
          <Link
            to="/incomes"
            style={{ marginRight: "1rem", textDecoration: "none" }}
          >
            Revenus
          </Link>
          <Link
            to="/envelopes"
            style={{ marginRight: "1rem", textDecoration: "none" }}
          >
            Enveloppes
          </Link>
          <span style={{ marginRight: "1rem" }}>
            Solde Total: {totalBalance} €
          </span>
          <button
            onClick={handleLogout}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Déconnexion
          </button>
        </>
      )}
      {!user && (
        <>
          <Link
            to="/login"
            style={{ marginRight: "1rem", textDecoration: "none" }}
          >
            Connexion
          </Link>
          <Link
            to="/register"
            style={{ marginRight: "1rem", textDecoration: "none" }}
          >
            Inscription
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
