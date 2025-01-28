// client/src/components/Layout/Navbar.jsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ backgroundColor: "#333", padding: "1rem" }}>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "1rem",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Accueil
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link
                to="/dashboard"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Tableau de bord
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Connexion
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Inscription
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
