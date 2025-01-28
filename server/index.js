// server/index.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Import des routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const envelopeRoutes = require("./routes/envelopeRoutes");
const accountRoutes = require("./routes/accountRoutes"); // Route des comptes

const app = express();

// Connexion à la DB
connectDB();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/envelopes", envelopeRoutes);
app.use("/api/accounts", accountRoutes); // Utiliser la nouvelle route

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
