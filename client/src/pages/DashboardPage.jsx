// client/src/pages/DashboardPage.jsx

import React from "react";
import Accounts from "../components/Accounts/Accounts";
import Expenses from "../components/Expenses/Expenses";
import Incomes from "../components/Incomes/Incomes";
import Envelopes from "../components/Envelopes/Envelopes";

const DashboardPage = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Tableau de bord</h2>
      <Accounts />
      <Expenses />
      <Incomes />
      <Envelopes />
    </div>
  );
};

export default DashboardPage;
