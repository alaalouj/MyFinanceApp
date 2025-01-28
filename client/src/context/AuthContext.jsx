// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

// Création du contexte d'authentification
export const AuthContext = createContext();

// Fournisseur de contexte pour envelopper l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [envelopes, setEnvelopes] = useState([]);

  // Vérifier si un token existe déjà dans le localStorage lors du montage du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setUser(userData);
      fetchAccounts();
      fetchEnvelopes();
    }
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAccounts([]);
    setEnvelopes([]);
  };

  // Fonction pour récupérer les comptes et portefeuilles
  const fetchAccounts = async () => {
    try {
      const { data } = await API.get("/accounts");
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour créer un nouveau compte ou portefeuille
  const createAccount = async (accountData) => {
    try {
      const { data } = await API.post("/accounts", accountData);
      setAccounts((prevAccounts) => [...prevAccounts, data]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fonction pour mettre à jour le solde d'un compte ou portefeuille
  const updateAccount = async (accountId, amount) => {
    try {
      const { data } = await API.put(`/accounts/${accountId}`, { amount });
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account._id === accountId ? data : account
        )
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fonction pour supprimer un compte ou portefeuille
  const deleteAccount = async (accountId) => {
    try {
      await API.delete(`/accounts/${accountId}`);
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account._id !== accountId)
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fonction pour récupérer les enveloppes
  const fetchEnvelopes = async () => {
    try {
      const { data } = await API.get("/envelopes");
      setEnvelopes(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour créer une nouvelle enveloppe
  const createEnvelope = async (envelopeData) => {
    try {
      const { data } = await API.post("/envelopes", envelopeData);
      setEnvelopes((prevEnvelopes) => [...prevEnvelopes, data]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fonction pour mettre à jour une enveloppe
  const updateEnvelope = async (envelopeId, amount) => {
    try {
      const { data } = await API.put(`/envelopes/${envelopeId}`, { amount });
      setEnvelopes((prevEnvelopes) =>
        prevEnvelopes.map((env) => (env._id === envelopeId ? data : env))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fonction pour supprimer une enveloppe
  const deleteEnvelope = async (envelopeId) => {
    try {
      await API.delete(`/envelopes/${envelopeId}`);
      setEnvelopes((prevEnvelopes) =>
        prevEnvelopes.filter((env) => env._id !== envelopeId)
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Calcul de la somme totale actuelle
  const totalBalance = accounts.reduce(
    (acc, account) => acc + account.balance,
    0
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        accounts,
        createAccount,
        updateAccount,
        deleteAccount,
        envelopes,
        createEnvelope,
        updateEnvelope,
        deleteEnvelope,
        totalBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
