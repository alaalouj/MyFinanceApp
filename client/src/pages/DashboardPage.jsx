// client/src/pages/DashboardPage.jsx

import React from "react";
import Accounts from "../components/Accounts/Accounts";
import Expenses from "../components/Dashboard/Expenses";
import Incomes from "../components/Dashboard/Incomes";
import Goals from "../components/Dashboard/Goals";
import Envelopes from "../components/Envelopes/Envelopes";

const DashboardPage = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Tableau de bord</h2>
      <Accounts />
      <Expenses />
      <Incomes />
      <Goals />
      <Envelopes />
    </div>
  );
};

export default DashboardPage;
