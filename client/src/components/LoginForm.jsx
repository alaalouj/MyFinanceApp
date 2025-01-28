// client/src/components/LoginForm.jsx
import React, { useState } from "react";
import API from "../services/api";

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.token);
      onSuccess(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Connexion</h2>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Entrez votre email"
          required
        />
      </div>
      <div>
        <label>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez votre mot de passe"
          required
        />
      </div>
      <button type="submit">Se connecter</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginForm;
