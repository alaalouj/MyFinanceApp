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
  const [totalBalance, setTotalBalance] = useState(0); // Somme totale des comptes et portefeuilles
  const [totalAllocated, setTotalAllocated] = useState(0); // Somme totale allouée aux enveloppes
  const [availableMoney, setAvailableMoney] = useState(0); // Argent disponible (non alloué)

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

  // Recalculer le totalBalance chaque fois que les comptes changent
  useEffect(() => {
    const balance = accounts.reduce((acc, account) => acc + account.balance, 0);
    setTotalBalance(balance);
  }, [accounts]);

  // Recalculer totalAllocated et availableMoney chaque fois que les enveloppes ou le totalBalance changent
  useEffect(() => {
    const allocated = envelopes.reduce((acc, env) => acc + env.amount, 0);
    setTotalAllocated(allocated);

    const available = totalBalance - allocated;
    setAvailableMoney(available >= 0 ? available : 0);
  }, [envelopes, totalBalance]);

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
    setTotalAllocated(0);
    setAvailableMoney(0);
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

  const updateEnvelope = async (envelopeId, updateData) => {
    try {
      const { data } = await API.put(`/envelopes/${envelopeId}`, updateData);
      setEnvelopes((prevEnvelopes) =>
        prevEnvelopes.map((env) => (env._id === envelopeId ? data : env))
      );
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error("Erreur lors de la mise à jour de l'enveloppe.");
      }
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
      // Mettre à jour les milestones de l'enveloppe dans l'état
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
      // Re-fetch accounts et enveloppes pour mettre à jour le totalBalance et les allocations
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
      // Re-fetch accounts et enveloppes pour mettre à jour le totalBalance et les allocations
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
      // Re-fetch accounts et enveloppes pour mettre à jour le totalBalance et les allocations
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
      // Re-fetch accounts et enveloppes pour mettre à jour le totalBalance et les allocations
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
      // Re-fetch accounts et enveloppes pour mettre à jour le totalBalance et les allocations
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
      // Re-fetch accounts et enveloppes pour mettre à jour le totalBalance et les allocations
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

  // Ajuster le montant d'une enveloppe (ajouter ou retirer)
  const adjustEnvelopeAmount = async (envelopeId, adjustment) => {
    try {
      // Trouvez l'enveloppe actuelle
      const envelope = envelopes.find((env) => env._id === envelopeId);
      if (!envelope) throw new Error("Enveloppe non trouvée.");

      // Calculez le nouveau montant
      const newAmount = envelope.amount + adjustment;

      // Validez que le nouveau montant n'est pas négatif
      if (newAmount < 0)
        throw new Error("Le montant de l'enveloppe ne peut pas être négatif.");

      // Mettez à jour l'enveloppe
      await updateEnvelope(envelopeId, { amount: newAmount });
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
        totalAllocated, // Fournir le total alloué
        availableMoney, // Fournir l'argent disponible
        adjustEnvelopeAmount, // Fournir la fonction d'ajustement
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
