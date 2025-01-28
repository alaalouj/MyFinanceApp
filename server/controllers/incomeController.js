// server/controllers/incomeController.js
const Income = require("../models/Income");

exports.createIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, source, date } = req.body;

    const newIncome = new Income({
      user: userId,
      amount,
      source,
      date: date || Date.now(),
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création du revenu." });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const userId = req.userId;
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des revenus." });
  }
};
