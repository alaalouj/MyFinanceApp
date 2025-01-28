// server/models/Saving.js

const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["compte", "espece"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Saving", savingSchema);
