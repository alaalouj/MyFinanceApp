// server/models/Goal.js
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    // Ex: "Voyage au Japon"
    type: String,
    required: true,
  },
  targetAmount: {
    // Montant total à atteindre
    type: Number,
    required: true,
  },
  currentAmount: {
    // Montant déjà épargné
    type: Number,
    default: 0,
  },
  deadline: {
    // Date limite pour atteindre l'objectif
    type: Date,
  },
});

module.exports = mongoose.model("Goal", goalSchema);
