// server/controllers/accountController.js

const Account = require("../models/Account");
const User = require("../models/User");

// Créer un nouveau compte ou portefeuille
exports.createAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, balance } = req.body;

    // Valider le type
    if (!["compte", "portefeuille"].includes(type)) {
      return res.status(400).json({ message: "Type de compte invalide." });
    }

    const account = new Account({
      user: userId,
      name,
      type,
      balance: balance || 0,
    });

    await account.save();

    // Ajouter la référence dans l'utilisateur
    await User.findByIdAndUpdate(userId, { $push: { accounts: account._id } });

    res.status(201).json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer tous les comptes et portefeuilles de l'utilisateur
exports.getAccounts = async (req, res) => {
  try {
    const userId = req.userId;
    const accounts = await Account.find({ user: userId });
    res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour le solde d'un compte ou portefeuille
exports.updateAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { accountId } = req.params;
    const { amount } = req.body; // Montant à ajouter (positif) ou retirer (négatif)

    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    account.balance += amount;

    // Assurez-vous que le solde ne devient pas négatif
    if (account.balance < 0) {
      return res.status(400).json({ message: "Solde insuffisant." });
    }

    await account.save();
    res.status(200).json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un compte ou portefeuille
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { accountId } = req.params;

    const account = await Account.findOneAndDelete({
      _id: accountId,
      user: userId,
    });
    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    // Retirer la référence dans l'utilisateur
    await User.findByIdAndUpdate(userId, { $pull: { accounts: accountId } });

    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
