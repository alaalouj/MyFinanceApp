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
    account.balance -= amount; // Débiter le compte
    await account.save();

    // Populer le compte pour renvoyer les détails complets
    await expense.populate("account");

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer toutes les dépenses de l'utilisateur avec les détails du compte, triées par date décroissante
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const expenses = await Expense.find({ user: userId })
      .populate("account")
      .sort({ date: -1 }); // Tri par date décroissante
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

    // Récupérer l'ancien compte et le nouvel compte si modifié
    const oldAccount = await Account.findOne({
      _id: expense.account,
      user: userId,
    });
    let newAccount = oldAccount;

    if (accountId && accountId !== expense.account.toString()) {
      newAccount = await Account.findOne({ _id: accountId, user: userId });
      if (!newAccount) {
        return res.status(404).json({ message: "Nouveau compte introuvable." });
      }
      expense.account = accountId;
    }

    // Calcul de la différence de montant
    const oldAmount = expense.amount;
    const newAmount = amount !== undefined ? amount : oldAmount;
    const difference = newAmount - oldAmount;

    // Mettre à jour le solde des comptes
    if (newAccount._id.toString() === oldAccount._id.toString()) {
      oldAccount.balance -= difference;
      await oldAccount.save();
    } else {
      // Débiter le nouvel compte et créditer l'ancien compte
      newAccount.balance -= newAmount;
      oldAccount.balance += oldAmount;
      await newAccount.save();
      await oldAccount.save();
    }

    // Mettre à jour les autres champs
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;

    await expense.save();

    // Populer le compte pour renvoyer les détails complets
    await expense.populate("account");

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
    }).populate("account");
    if (!expense) {
      return res.status(404).json({ message: "Dépense introuvable." });
    }

    // Rembourser le montant au compte
    const account = expense.account;
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
