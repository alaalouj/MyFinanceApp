// server/routes/budgetRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

// Créer un budget
router.post("/", auth, createBudget);

// Récupérer tous les budgets
router.get("/", auth, getBudgets);

// Mettre à jour un budget
router.put("/:budgetId", auth, updateBudget);

// Supprimer un budget
router.delete("/:budgetId", auth, deleteBudget);

module.exports = router;
