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
    account.balance += amount; // Créditer le compte
    await account.save();

    // Populer le compte pour renvoyer les détails complets
    await income.populate("account");

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

    // Récupérer l'ancien compte et le nouvel compte si modifié
    const oldAccount = await Account.findOne({
      _id: income.account,
      user: userId,
    });
    let newAccount = oldAccount;

    if (accountId && accountId !== income.account.toString()) {
      newAccount = await Account.findOne({ _id: accountId, user: userId });
      if (!newAccount) {
        return res.status(404).json({ message: "Nouveau compte introuvable." });
      }
      income.account = accountId;
    }

    // Calcul de la différence de montant
    const oldAmount = income.amount;
    const newAmount = amount !== undefined ? amount : oldAmount;
    const difference = newAmount - oldAmount;

    // Mettre à jour le solde des comptes
    if (newAccount._id.toString() === oldAccount._id.toString()) {
      oldAccount.balance += difference;
      await oldAccount.save();
    } else {
      // Créditer le nouveau compte et débiter l'ancien compte
      newAccount.balance += newAmount;
      oldAccount.balance -= oldAmount;
      await newAccount.save();
      await oldAccount.save();
    }

    // Mettre à jour les autres champs
    if (description !== undefined) income.description = description;
    if (amount !== undefined) income.amount = amount;
    if (category !== undefined) income.category = category;
    if (date !== undefined) income.date = date;

    await income.save();

    // Populer le compte pour renvoyer les détails complets
    await income.populate("account");

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
    }).populate("account");
    if (!income) {
      return res.status(404).json({ message: "Revenu introuvable." });
    }

    // Débiter le montant du compte
    const account = income.account;
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
