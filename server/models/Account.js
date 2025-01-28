// server/models/Account.js

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    // Nom du compte ou portefeuille
    type: String,
    required: true,
  },
  type: {
    // 'compte' ou 'portefeuille'
    type: String,
    enum: ["compte", "portefeuille"],
    required: true,
  },
  balance: {
    // Solde actuel
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", accountSchema);
