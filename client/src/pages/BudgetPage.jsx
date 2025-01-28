// client/src/pages/BudgetPage.jsx

import React from "react";
import BudgetForm from "../components/Budget/BudgetForm";

const BudgetPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Budget</h2>
      <BudgetForm />
    </div>
  );
};

export default BudgetPage;
