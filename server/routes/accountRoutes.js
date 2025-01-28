// server/routes/accountRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} = require("../controllers/accountController");

// Créer un compte ou portefeuille
router.post("/", auth, createAccount);

// Récupérer tous les comptes et portefeuilles
router.get("/", auth, getAccounts);

// Mettre à jour le solde d'un compte ou portefeuille
router.put("/:accountId", auth, updateAccount);

// Supprimer un compte ou portefeuille
router.delete("/:accountId", auth, deleteAccount);

module.exports = router;
