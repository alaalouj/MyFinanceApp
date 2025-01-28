// server/controllers/goalController.js
const Goal = require("../models/Goal");

exports.createGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, targetAmount, currentAmount, deadline } = req.body;

    const newGoal = new Goal({
      user: userId,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'objectif." });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await Goal.find({ user: userId });
    res.status(200).json(goals);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des objectifs." });
  }
};

// Méthode simple de calcul du montant à épargner par mois
exports.getMonthlySavingAdvice = async (req, res) => {
  try {
    const userId = req.userId;
    const { goalId } = req.params;
    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return res.status(404).json({ message: "Objectif introuvable." });
    }

    if (!goal.deadline) {
      return res.status(400).json({
        message: "Impossible de calculer le montant mensuel sans date limite.",
      });
    }

    // Calculer le nombre de mois restants
    const now = new Date();
    const monthsDiff =
      (goal.deadline.getFullYear() - now.getFullYear()) * 12 +
      (goal.deadline.getMonth() - now.getMonth());

    if (monthsDiff <= 0) {
      return res.status(400).json({
        message:
          "La date limite est déjà dépassée ou trop proche pour effectuer un calcul.",
      });
    }

    const remainingAmount = goal.targetAmount - goal.currentAmount;
    if (remainingAmount <= 0) {
      return res
        .status(200)
        .json({ message: "Objectif déjà atteint ou dépassé !" });
    }

    const monthlySaving = remainingAmount / monthsDiff;

    res.status(200).json({
      monthlySaving: monthlySaving.toFixed(2),
      message: `Vous devriez épargner environ ${monthlySaving.toFixed(
        2
      )} par mois pour atteindre l'objectif.`,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors du calcul d'épargne mensuelle." });
  }
};
