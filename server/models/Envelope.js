// server/models/Envelope.js

const mongoose = require("mongoose");

const envelopeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    // Nom de l'enveloppe (ex: "Voyage", "Courses")
    type: String,
    required: true,
  },
  type: {
    // 'simple' ou 'objectif'
    type: String,
    enum: ["simple", "objectif"],
    required: true,
    default: "simple",
  },
  amount: {
    // Montant actuel dans l'enveloppe
    type: Number,
    required: true,
    default: 0,
  },
  goalAmount: {
    // Montant cible à atteindre (si type 'objectif')
    type: Number,
    required: function () {
      return this.type === "objectif";
    },
  },
  progress: {
    // Pourcentage de progression
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calcul automatique de la progression avant la sauvegarde
envelopeSchema.pre("save", function (next) {
  if (this.type === "objectif" && this.goalAmount) {
    this.progress = (this.amount / this.goalAmount) * 100;
    if (this.progress > 100) this.progress = 100; // Limiter à 100%
    if (this.progress < 0) this.progress = 0; // Limiter à 0%
  }
  next();
});

module.exports = mongoose.model("Envelope", envelopeSchema);
