// server/controllers/envelopeController.js

const Envelope = require("../models/Envelope");

// Créer une nouvelle enveloppe avec échelons
exports.createEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, amount, goalAmount, milestones } = req.body;

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

    // Si des milestones sont fournis, les valider
    if (type === "objectif" && milestones && milestones.length > 0) {
      for (const milestone of milestones) {
        if (!milestone.name || !milestone.amount) {
          return res.status(400).json({
            message: "Chaque échelon doit avoir un nom et un montant.",
          });
        }
      }
    }

    const envelope = new Envelope({
      user: userId,
      name,
      type,
      amount,
      goalAmount: type === "objectif" ? goalAmount : undefined,
      milestones: type === "objectif" ? milestones : [],
    });

    await envelope.save();
    res.status(201).json(envelope);
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
    const { amount } = req.body; // Montant à ajouter (positif) ou retirer (négatif)

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    // Calculer le nouveau montant
    const newAmount = envelope.amount + amount;

    // Si retirer de l'argent, assurer que le solde ne devient pas négatif
    if (newAmount < 0) {
      return res
        .status(400)
        .json({ message: "Solde insuffisant dans l'enveloppe." });
    }

    envelope.amount = newAmount;

    // Recalculer la progression si applicable
    if (envelope.type === "objectif" && envelope.goalAmount) {
      envelope.progress = (envelope.amount / envelope.goalAmount) * 100;
      if (envelope.progress > 100) envelope.progress = 100; // Limiter à 100%
      if (envelope.progress < 0) envelope.progress = 0; // Limiter à 0%

      // Vérifier si des milestones sont atteints
      envelope.milestones.forEach((milestone) => {
        if (!milestone.achieved && envelope.amount >= milestone.amount) {
          milestone.achieved = true;
        }
      });
    }

    await envelope.save();
    res.status(200).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Ajouter un échelon à une enveloppe
exports.addMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId } = req.params;
    const { name, amount } = req.body;

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    if (envelope.type !== "objectif") {
      return res.status(400).json({
        message:
          "Seuls les enveloppes avec objectif peuvent avoir des échelons.",
      });
    }

    if (!name || !amount) {
      return res
        .status(400)
        .json({ message: "Nom et montant de l'échelon sont requis." });
    }

    envelope.milestones.push({ name, amount });
    await envelope.save();
    res.status(201).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un échelon d'une enveloppe
exports.deleteMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId, milestoneId } = req.params;

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    const milestone = envelope.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Échelon introuvable." });
    }

    milestone.remove();
    await envelope.save();
    res.status(200).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer toutes les enveloppes
exports.getEnvelopes = async (req, res) => {
  try {
    const userId = req.userId; // Assure-toi que userId est correctement récupéré, par exemple via middleware d'authentification
    const envelopes = await Envelope.find({ user: userId });
    res.json(envelopes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la récupération des enveloppes.",
      });
  }
};

// Supprimer une enveloppe
exports.deleteEnvelope = async (req, res) => {
  try {
    const { envelopeId } = req.params;
    const userId = req.userId; // Assure-toi que userId est récupéré correctement

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
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la suppression de l'enveloppe.",
      });
  }
};
