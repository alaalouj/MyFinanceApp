// server/routes/savingRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createOrUpdateSaving,
  getSavings,
} = require("../controllers/savingController");

// Route pour créer ou mettre à jour une épargne
router.post("/", auth, createOrUpdateSaving);

// Route pour récupérer les épargnes de l'utilisateur
router.get("/", auth, getSavings);

module.exports = router;
