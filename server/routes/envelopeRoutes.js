// server/routes/envelopeRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createEnvelope,
  getEnvelopes,
  updateEnvelope,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  deleteEnvelope,
} = require("../controllers/envelopeController");

// Créer une enveloppe
router.post("/", auth, createEnvelope);

// Récupérer toutes les enveloppes
router.get("/", auth, getEnvelopes);

// Mettre à jour une enveloppe (ajouter/retirer un montant)
router.put("/:envelopeId", auth, updateEnvelope);

// Ajouter un seuil/milestone
router.post("/:envelopeId/milestones", auth, addMilestone);

// Mettre à jour un seuil/milestone
router.put("/:envelopeId/milestones/:milestoneId", auth, updateMilestone);

// Supprimer un seuil/milestone
router.delete("/:envelopeId/milestones/:milestoneId", auth, deleteMilestone);

// Supprimer une enveloppe
router.delete("/:envelopeId", auth, deleteEnvelope);

module.exports = router;
