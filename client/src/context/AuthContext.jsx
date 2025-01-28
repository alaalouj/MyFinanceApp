// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

// Création du contexte d'authentification
export const AuthContext = createContext();

// Fournisseur de contexte pour envelopper l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [savings, setSavings] = useState([]);

  // Vérifier si un token existe déjà dans le localStorage lors du montage du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setUser(userData);
      fetchSavings();
    }
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    fetchSavings();
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSavings([]);
  };

  // Fonction pour récupérer les épargnes
  const fetchSavings = async () => {
    try {
      const { data } = await API.get("/savings");
      setSavings(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour créer ou mettre à jour une épargne
  const updateSaving = async (type, amount) => {
    try {
      const { data } = await API.post("/savings", { type, amount });
      // Mettre à jour localement
      setSavings((prevSavings) =>
        prevSavings.map((saving) => (saving.type === type ? data : saving))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, savings, updateSaving }}
    >
      {children}
    </AuthContext.Provider>
  );
};
