// server/controllers/budgetController.js

const Budget = require("../models/Budget");

// Créer un nouveau budget
exports.createBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const budgetData = req.body;
    budgetData.user = userId;

    const budget = new Budget(budgetData);
    await budget.save();

    res.status(201).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer tous les budgets de l'utilisateur
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const budgets = await Budget.find({ user: userId });
    res.status(200).json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour un budget
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { budgetId } = req.params;
    const updateData = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, user: userId },
      updateData,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget introuvable." });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un budget
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { budgetId } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget introuvable." });
    }

    res.status(200).json({ message: "Budget supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
