// client/src/pages/HomePage.jsx
import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import LoginForm from "../components/LoginForm";

function HomePage() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div>
      <h1>Gestion de Finances</h1>
      {user ? <Dashboard /> : <LoginForm onSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default HomePage;
