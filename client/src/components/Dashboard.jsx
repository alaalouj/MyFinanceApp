// client/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/expenses");
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIncomes = async () => {
    try {
      const { data } = await API.get("/incomes");
      setIncomes(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Tableau de bord</h2>
      <section>
        <h3>Dépenses</h3>
        <ul>
          {expenses.map((exp) => (
            <li key={exp._id}>
              {exp.date} - {exp.amount} € - {exp.category} ({exp.description})
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Revenus</h3>
        <ul>
          {incomes.map((inc) => (
            <li key={inc._id}>
              {inc.date} - {inc.amount} € - {inc.source}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
