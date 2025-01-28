// server/controllers/incomeController.js

const Income = require("../models/Income");
const Account = require("../models/Account");

// Créer un nouveau revenu
exports.createIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const { accountId, description, amount, category, date } = req.body;

    // Vérifier si le compte existe et appartient à l'utilisateur
    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    const income = new Income({
      user: userId,
      account: accountId,
      description,
      amount,
      category,
      date: date || Date.now(),
    });

    await income.save();

    // Mettre à jour le solde du compte
    account.balance += amount;
    await account.save();

    res.status(201).json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer tous les revenus de l'utilisateur avec les détails du compte
exports.getIncomes = async (req, res) => {
  try {
    const userId = req.userId;
    const incomes = await Income.find({ user: userId }).populate("account");
    res.status(200).json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour un revenu
exports.updateIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const { incomeId } = req.params;
    const { accountId, description, amount, category, date } = req.body;

    const income = await Income.findOne({ _id: incomeId, user: userId });
    if (!income) {
      return res.status(404).json({ message: "Revenu introuvable." });
    }

    // Si le compte est modifié
    if (accountId && accountId !== income.account.toString()) {
      const oldAccount = await Account.findOne({
        _id: income.account,
        user: userId,
      });
      const newAccount = await Account.findOne({
        _id: accountId,
        user: userId,
      });

      if (!newAccount) {
        return res.status(404).json({ message: "Nouveau compte introuvable." });
      }

      // Mettre à jour les soldes
      oldAccount.balance -= income.amount; // Débiter l'ancien compte
      newAccount.balance += amount; // Créditez le nouveau compte

      await oldAccount.save();
      await newAccount.save();

      income.account = accountId;
    } else if (amount && amount !== income.amount) {
      const account = await Account.findOne({
        _id: income.account,
        user: userId,
      });

      const difference = amount - income.amount;

      account.balance += difference;
      await account.save();
    }

    // Mettre à jour les autres champs
    if (description) income.description = description;
    if (amount) income.amount = amount;
    if (category) income.category = category;
    if (date) income.date = date;

    await income.save();

    res.status(200).json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un revenu
exports.deleteIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const { incomeId } = req.params;

    const income = await Income.findOneAndDelete({
      _id: incomeId,
      user: userId,
    });
    if (!income) {
      return res.status(404).json({ message: "Revenu introuvable." });
    }

    // Débiter le montant du compte
    const account = await Account.findOne({
      _id: income.account,
      user: userId,
    });
    if (account) {
      account.balance -= income.amount;
      await account.save();
    }

    res.status(200).json({ message: "Revenu supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
