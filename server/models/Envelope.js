// server/models/Envelope.js

const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    achieved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const EnvelopeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assurez-vous que ce modèle existe
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["simple", "objectif"],
      default: "simple",
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    milestones: [MilestoneSchema], // Définir comme sous-documents
  },
  { timestamps: true }
);

module.exports = mongoose.model("Envelope", EnvelopeSchema);
