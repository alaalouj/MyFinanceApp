// server/controllers/expenseController.js
const Expense = require("../models/Expense");
const { categorizeExpense } = require("../utils/categorization");

exports.createExpense = async (req, res) => {
  try {
    const userId = req.userId; // récupéré depuis le middleware d'auth
    let { amount, category, description, date } = req.body;

    // Catégorisation automatique si la catégorie n'est pas fournie
    if (!category) {
      category = categorizeExpense(description);
    }

    const newExpense = new Expense({
      user: userId,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la dépense." });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des dépenses." });
  }
};

// ... vous pouvez ajouter des méthodes pour mettre à jour ou supprimer une dépense.
