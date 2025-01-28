// server/models/Envelope.js

const mongoose = require("mongoose");

const envelopeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["simple", "objectif"],
    required: true,
    default: "simple",
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  goalAmount: {
    type: Number,
    // Requis uniquement si type est 'objectif'
    required: function () {
      return this.type === "objectif";
    },
  },
  progress: {
    type: Number,
    default: 0, // Calculé automatiquement
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
  }
  next();
});

module.exports = mongoose.model("Envelope", envelopeSchema);
