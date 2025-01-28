// server/controllers/envelopeController.js

const Envelope = require("../models/Envelope");
const Account = require("../models/Account");

// Créer une nouvelle enveloppe
exports.createEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, amount, goalAmount } = req.body;

    const envelope = new Envelope({
      user: userId,
      name,
      type,
      amount,
      goalAmount: type === "objectif" ? goalAmount : undefined,
      milestones: [],
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

// Mettre à jour une enveloppe (ajouter ou retirer un montant)
exports.updateEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId } = req.params;
    const { amount } = req.body; // Positive pour ajouter, négatif pour retirer

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    envelope.amount += amount;

    // Mettre à jour les milestones' achieved status
    if (envelope.type === "objectif" && envelope.goalAmount) {
      envelope.milestones = envelope.milestones.map((milestone) => ({
        ...milestone.toObject(),
        achieved: envelope.amount >= milestone.amount,
      }));
    }

    await envelope.save();

    res.status(200).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Ajouter un seuil/milestone à une enveloppe
exports.addMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId } = req.params;
    const { name, amount } = req.body;

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    const milestone = {
      name,
      amount,
      achieved: envelope.amount >= amount,
    };

    envelope.milestones.push(milestone);
    await envelope.save();

    res.status(201).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour un seuil/milestone
exports.updateMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId, milestoneId } = req.params;
    const { name, amount } = req.body;

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    const milestone = envelope.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Seuil introuvable." });
    }

    milestone.name = name !== undefined ? name : milestone.name;
    milestone.amount = amount !== undefined ? amount : milestone.amount;
    milestone.achieved = envelope.amount >= milestone.amount;

    await envelope.save();

    res.status(200).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un seuil/milestone
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
      return res.status(404).json({ message: "Seuil introuvable." });
    }

    milestone.remove();
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
