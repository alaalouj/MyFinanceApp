// server/models/Envelope.js

const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    achieved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Nouveau schéma pour l'historique
const HistorySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const EnvelopeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["simple", "objectif"], default: "simple" },
    amount: { type: Number, default: 0, min: 0 },
    goalAmount: { type: Number, default: 0, min: 0 },
    milestones: [MilestoneSchema],
    // Ajout de l'historique des transactions
    history: [HistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Envelope", EnvelopeSchema);
