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
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]); // Ajout de l'état des budgets
  const [totalBalance, setTotalBalance] = useState(0); // Initialize to 0

  // Vérifier si un token existe déjà dans le localStorage lors du montage du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setUser(userData);
      fetchAccounts();
      fetchEnvelopes();
      fetchExpenses();
      fetchIncomes();
      fetchBudgets(); // Charger les budgets
    }
  }, []);

  // Recalculate totalBalance whenever accounts change
  useEffect(() => {
    const balance = accounts.reduce((acc, account) => acc + account.balance, 0);
    setTotalBalance(balance);
  }, [accounts]);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      await fetchAccounts();
      await fetchEnvelopes();
      await fetchExpenses();
      await fetchIncomes();
      await fetchBudgets(); // Charger les budgets
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
    setExpenses([]);
    setIncomes([]);
    setBudgets([]); // Réinitialiser les budgets
    setTotalBalance(0);
  };

  // Comptes et Portefeuilles
  const fetchAccounts = async () => {
    try {
      const { data } = await API.get("/accounts");
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createAccount = async (accountData) => {
    try {
      const { data } = await API.post("/accounts", accountData);
      setAccounts((prevAccounts) => [...prevAccounts, data]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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

  // Enveloppes Budgétaires
  const fetchEnvelopes = async () => {
    try {
      const { data } = await API.get("/envelopes");
      setEnvelopes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createEnvelope = async (envelopeData) => {
    try {
      const { data } = await API.post("/envelopes", envelopeData);
      setEnvelopes((prevEnvelopes) => [...prevEnvelopes, data]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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

  const addMilestone = async (envelopeId, milestoneData) => {
    try {
      const { data } = await API.post(
        `/envelopes/${envelopeId}/milestones`,
        milestoneData
      );
      setEnvelopes((prevEnvelopes) =>
        prevEnvelopes.map((env) => (env._id === envelopeId ? data : env))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateMilestone = async (envelopeId, milestoneId, updatedData) => {
    try {
      const { data } = await API.put(
        `/envelopes/${envelopeId}/milestones/${milestoneId}`,
        updatedData
      );
      // Update the envelope's milestones in the state
      setEnvelopes((prevEnvelopes) =>
        prevEnvelopes.map((env) => (env._id === envelopeId ? data : env))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteMilestone = async (envelopeId, milestoneId) => {
    try {
      const { data } = await API.delete(
        `/envelopes/${envelopeId}/milestones/${milestoneId}`
      );
      setEnvelopes((prevEnvelopes) =>
        prevEnvelopes.map((env) => (env._id === envelopeId ? data : env))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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

  // Dépenses
  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/expenses");
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      const { data } = await API.post("/expenses", expenseData);
      setExpenses((prevExpenses) => [...prevExpenses, data]);
      // Re-fetch accounts and envelopes to update total balance and progress
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      const { data } = await API.put(`/expenses/${expenseId}`, expenseData);
      setExpenses((prevExpenses) =>
        prevExpenses.map((exp) => (exp._id === expenseId ? data : exp))
      );
      // Re-fetch accounts and envelopes to update total balance and progress
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await API.delete(`/expenses/${expenseId}`);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((exp) => exp._id !== expenseId)
      );
      // Re-fetch accounts and envelopes to update total balance and progress
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Revenus
  const fetchIncomes = async () => {
    try {
      const { data } = await API.get("/incomes");
      setIncomes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createIncome = async (incomeData) => {
    try {
      const { data } = await API.post("/incomes", incomeData);
      setIncomes((prevIncomes) => [...prevIncomes, data]);
      // Re-fetch accounts and envelopes to update total balance and progress
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateIncome = async (incomeId, incomeData) => {
    try {
      const { data } = await API.put(`/incomes/${incomeId}`, incomeData);
      setIncomes((prevIncomes) =>
        prevIncomes.map((inc) => (inc._id === incomeId ? data : inc))
      );
      // Re-fetch accounts and envelopes to update total balance and progress
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteIncome = async (incomeId) => {
    try {
      await API.delete(`/incomes/${incomeId}`);
      setIncomes((prevIncomes) =>
        prevIncomes.filter((inc) => inc._id !== incomeId)
      );
      // Re-fetch accounts and envelopes to update total balance and progress
      await fetchAccounts();
      await fetchEnvelopes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Budgets
  const fetchBudgets = async () => {
    try {
      const { data } = await API.get("/budgets");
      setBudgets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBudget = async (budgetData) => {
    try {
      const { data } = await API.post("/budgets", budgetData);
      setBudgets((prevBudgets) => [...prevBudgets, data]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateBudget = async (budgetId, budgetData) => {
    try {
      const { data } = await API.put(`/budgets/${budgetId}`, budgetData);
      setBudgets((prevBudgets) =>
        prevBudgets.map((bud) => (bud._id === budgetId ? data : bud))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteBudget = async (budgetId) => {
    try {
      await API.delete(`/budgets/${budgetId}`);
      setBudgets((prevBudgets) =>
        prevBudgets.filter((bud) => bud._id !== budgetId)
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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
        addMilestone,
        updateMilestone,
        deleteMilestone,
        deleteEnvelope,
        expenses,
        createExpense,
        updateExpense,
        deleteExpense,
        incomes,
        createIncome,
        updateIncome,
        deleteIncome,
        budgets, // Fournir les budgets
        createBudget,
        updateBudget,
        deleteBudget,
        totalBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
