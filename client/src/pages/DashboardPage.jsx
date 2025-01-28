// client/src/pages/DashboardPage.jsx

import React from "react";
import Expenses from "../components/Dashboard/Expenses";
import Incomes from "../components/Dashboard/Incomes";
import Goals from "../components/Dashboard/Goals";
import Savings from "../components/Savings/Savings";
import Envelopes from "../components/Envelopes/Envelopes";

const DashboardPage = () => {
  return (
    <div>
      <h2>Tableau de bord</h2>
      <Savings />
      <Expenses />
      <Incomes />
      <Goals />
      <Envelopes />
    </div>
  );
};

export default DashboardPage;
