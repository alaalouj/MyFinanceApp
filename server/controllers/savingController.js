// server/controllers/savingController.js

const Saving = require("../models/Saving");
const User = require("../models/User");

// Créer ou Mettre à jour une Épargne
exports.createOrUpdateSaving = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, amount } = req.body;

    // Valider le type
    if (!["compte", "espece"].includes(type)) {
      return res.status(400).json({ message: "Type d'épargne invalide." });
    }

    // Trouver l'épargne existante
    let saving = await Saving.findOne({ user: userId, type });

    if (saving) {
      // Mettre à jour le montant
      saving.amount = amount;
      await saving.save();
      return res.status(200).json(saving);
    } else {
      // Créer une nouvelle épargne
      saving = new Saving({ user: userId, type, amount });
      await saving.save();

      // Ajouter la référence dans l'utilisateur
      await User.findByIdAndUpdate(userId, { $push: { savings: saving._id } });

      return res.status(201).json(saving);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer les Épargnes de l'utilisateur
exports.getSavings = async (req, res) => {
  try {
    const userId = req.userId;
    const savings = await Saving.find({ user: userId });
    res.status(200).json(savings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
