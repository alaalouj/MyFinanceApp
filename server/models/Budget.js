// server/models/Budget.js

const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    loyer: { type: Number, default: 0 },
    salle: { type: Number, default: 0 },
    netflix: { type: Number, default: 0 },
    spotify: { type: Number, default: 0 },
    operateurTel: { type: Number, default: 0 },
    chatGPT: { type: Number, default: 0 },
    sogessur: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    laverie: { type: Number, default: 0 },
    coiffeur: { type: Number, default: 0 },
    alimentation: { type: Number, default: 0 },
    sorties: { type: Number, default: 0 },
    vestimentaire: { type: Number, default: 0 },
    sante: { type: Number, default: 0 },
    technologique: { type: Number, default: 0 },
    cadeaux: { type: Number, default: 0 },
    divers: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
