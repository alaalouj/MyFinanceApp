// server/controllers/envelopeController.js

const Envelope = require("../models/Envelope");

// Créer une nouvelle enveloppe
exports.createEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, amount, goalAmount } = req.body;

    // Valider le type
    if (!["simple", "objectif"].includes(type)) {
      return res.status(400).json({ message: "Type d'enveloppe invalide." });
    }

    // Si type est 'objectif', goalAmount est requis
    if (type === "objectif" && (!goalAmount || goalAmount <= 0)) {
      return res.status(400).json({
        message: "Montant cible requis pour une enveloppe avec objectif.",
      });
    }

    const envelope = new Envelope({
      user: userId,
      name,
      type,
      amount,
      goalAmount: type === "objectif" ? goalAmount : undefined,
    });

    await envelope.save();
    res.status(201).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer toutes les enveloppes de l'utilisateur
exports.getEnvelopes = async (req, res) => {
  try {
    const userId = req.userId;
    const envelopes = await Envelope.find({ user: userId });
    res.status(200).json(envelopes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour une enveloppe (ajouter ou retirer de l'argent)
exports.updateEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId } = req.params;
    const { amount } = req.body;

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    envelope.amount += amount; // Ajouter (si positif) ou retirer (si négatif) de l'argent

    // Si l'enveloppe a un objectif, recalculer la progression
    if (envelope.type === "objectif" && envelope.goalAmount) {
      envelope.progress = (envelope.amount / envelope.goalAmount) * 100;
      if (envelope.progress > 100) envelope.progress = 100; // Limiter à 100%
    }

    await envelope.save();
    res.status(200).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer une enveloppe
exports.deleteEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId } = req.params;

    const envelope = await Envelope.findOneAndDelete({
      _id: envelopeId,
      user: userId,
    });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    res.status(200).json({ message: "Enveloppe supprimée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
