// server/routes/envelopeRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Middleware d'authentification
const {
  createEnvelope,
  getEnvelopes,
  updateEnvelope,
  deleteEnvelope,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  getFinancialSummary,
  addHistory,
} = require("../controllers/envelopeController");

// Créer une enveloppe
router.post("/", auth, createEnvelope);

// Récupérer toutes les enveloppes
router.get("/", auth, getEnvelopes);

// Mettre à jour une enveloppe
router.put("/:envelopeId", auth, updateEnvelope);

// Supprimer une enveloppe
router.delete("/:envelopeId", auth, deleteEnvelope);

// Ajouter un milestone
router.post("/:envelopeId/milestones", auth, addMilestone);

// Mettre à jour un milestone
router.put("/:envelopeId/milestones/:milestoneId", auth, updateMilestone);

// Supprimer un milestone
router.delete("/:envelopeId/milestones/:milestoneId", auth, deleteMilestone);

// Récupérer le résumé financier
router.get("/summary", auth, getFinancialSummary);

// Ajouter une nouvelle entrée d'historique
router.post("/:envelopeId/history", auth, addHistory);

module.exports = router;
