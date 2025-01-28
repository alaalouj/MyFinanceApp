// server/controllers/expenseController.js

const Expense = require("../models/Expense");
const Account = require("../models/Account");

// Créer une nouvelle dépense
exports.createExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { accountId, description, amount, category, date } = req.body;

    // Vérifier si le compte existe et appartient à l'utilisateur
    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    // Vérifier si le solde est suffisant
    if (account.balance < amount) {
      return res
        .status(400)
        .json({ message: "Solde insuffisant dans le compte." });
    }

    const expense = new Expense({
      user: userId,
      account: accountId,
      description,
      amount,
      category,
      date: date || Date.now(),
    });

    await expense.save();

    // Mettre à jour le solde du compte
    account.balance -= amount;
    await account.save();

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer toutes les dépenses de l'utilisateur avec les détails du compte
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const expenses = await Expense.find({ user: userId }).populate("account");
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour une dépense
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { expenseId } = req.params;
    const { accountId, description, amount, category, date } = req.body;

    const expense = await Expense.findOne({ _id: expenseId, user: userId });
    if (!expense) {
      return res.status(404).json({ message: "Dépense introuvable." });
    }

    // Si le compte est modifié
    if (accountId && accountId !== expense.account.toString()) {
      const oldAccount = await Account.findOne({
        _id: expense.account,
        user: userId,
      });
      const newAccount = await Account.findOne({
        _id: accountId,
        user: userId,
      });

      if (!newAccount) {
        return res.status(404).json({ message: "Nouveau compte introuvable." });
      }

      // Vérifier si le nouveau compte a suffisamment de solde
      if (newAccount.balance < amount) {
        return res
          .status(400)
          .json({ message: "Solde insuffisant dans le nouveau compte." });
      }

      // Mettre à jour les soldes
      oldAccount.balance += expense.amount; // Rembourser l'ancien compte
      newAccount.balance -= amount; // Débiter le nouveau compte

      await oldAccount.save();
      await newAccount.save();

      expense.account = accountId;
    } else if (amount && amount !== expense.amount) {
      const account = await Account.findOne({
        _id: expense.account,
        user: userId,
      });

      const difference = amount - expense.amount;

      if (difference > 0 && account.balance < difference) {
        return res
          .status(400)
          .json({ message: "Solde insuffisant dans le compte." });
      }

      account.balance -= difference;
      await account.save();
    }

    // Mettre à jour les autres champs
    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;

    await expense.save();

    res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer une dépense
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { expenseId } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: userId,
    });
    if (!expense) {
      return res.status(404).json({ message: "Dépense introuvable." });
    }

    // Rembourser le montant au compte
    const account = await Account.findOne({
      _id: expense.account,
      user: userId,
    });
    if (account) {
      account.balance += expense.amount;
      await account.save();
    }

    res.status(200).json({ message: "Dépense supprimée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
