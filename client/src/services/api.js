// client/src/services/api.js
import axios from "axios";

// On récupère l'URL depuis le .env (VITE_API_URL)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercepteur pour ajouter le token dans les en-têtes si présent
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
