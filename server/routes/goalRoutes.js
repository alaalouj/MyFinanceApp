// server/routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createGoal,
  getGoals,
  getMonthlySavingAdvice,
} = require("../controllers/goalController");

router.post("/", auth, createGoal);
router.get("/", auth, getGoals);
router.get("/:goalId/advice", auth, getMonthlySavingAdvice);

module.exports = router;
