// server/routes/incomeRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");

// Créer un revenu
router.post("/", auth, createIncome);

// Récupérer tous les revenus
router.get("/", auth, getIncomes);

// Mettre à jour un revenu
router.put("/:incomeId", auth, updateIncome);

// Supprimer un revenu
router.delete("/:incomeId", auth, deleteIncome);

module.exports = router;
