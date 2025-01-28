// server/models/Envelope.js

const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    achieved: { type: Boolean, default: false },
  },
  { _id: true }
);

const EnvelopeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["simple", "objectif"], default: "simple" },
    amount: { type: Number, default: 0 },
    goalAmount: { type: Number, default: 0 },
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Envelope", EnvelopeSchema);
