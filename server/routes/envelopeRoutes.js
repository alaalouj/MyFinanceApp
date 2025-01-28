// server/routes/envelopeRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createEnvelope,
  getEnvelopes,
  updateEnvelope,
  deleteEnvelope,
  addMilestone,
  deleteMilestone,
} = require("../controllers/envelopeController");

// Créer une enveloppe
router.post("/", auth, createEnvelope);

// Récupérer toutes les enveloppes
router.get("/", auth, getEnvelopes);

// Mettre à jour une enveloppe (ajouter/retraiter de l'argent)
router.put("/:envelopeId", auth, updateEnvelope);

// Supprimer une enveloppe
router.delete("/:envelopeId", auth, deleteEnvelope);

// Ajouter un échelon à une enveloppe
router.post("/:envelopeId/milestones", auth, addMilestone);

// Supprimer un échelon d'une enveloppe
router.delete("/:envelopeId/milestones/:milestoneId", auth, deleteMilestone);

module.exports = router;
