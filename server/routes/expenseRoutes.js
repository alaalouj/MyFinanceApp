// server/routes/expenseRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// Créer une dépense
router.post("/", auth, createExpense);

// Récupérer toutes les dépenses
router.get("/", auth, getExpenses);

// Mettre à jour une dépense
router.put("/:expenseId", auth, updateExpense);

// Supprimer une dépense
router.delete("/:expenseId", auth, deleteExpense);

module.exports = router;
