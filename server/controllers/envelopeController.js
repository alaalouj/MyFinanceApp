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
      amount: amount || 0,
      goalAmount: goalAmount || 0,
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

// Mettre à jour une enveloppe (y compris l'objectif et le montant)
exports.updateEnvelope = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId } = req.params;
    const { name, type, amount, goalAmount } = req.body;

    console.log("Données reçues pour la mise à jour:", {
      name,
      type,
      amount,
      goalAmount,
    });

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = amount;
    if (goalAmount !== undefined) updateData.goalAmount = goalAmount;

    console.log("Données de mise à jour préparées:", updateData);

    const envelope = await Envelope.findOneAndUpdate(
      { _id: envelopeId, user: userId },
      { $set: updateData }, // Utiliser $set pour définir les valeurs
      { new: true }
    );

    console.log("Enveloppe après mise à jour:", envelope);

    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

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

    const milestone = { name, amount, achieved: false };
    envelope.milestones.push(milestone);
    await envelope.save();

    res.status(201).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Mettre à jour un milestone
exports.updateMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId, milestoneId } = req.params;
    const updateData = req.body;

    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });

    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    const milestone = envelope.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Seuil introuvable." });
    }

    milestone.set(updateData);
    await envelope.save();

    res.status(200).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { envelopeId, milestoneId } = req.params;

    // Rechercher l'enveloppe appartenant à l'utilisateur
    const envelope = await Envelope.findOne({ _id: envelopeId, user: userId });
    if (!envelope) {
      return res.status(404).json({ message: "Enveloppe introuvable." });
    }

    // Trouver le milestone par son ID
    const milestone = envelope.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Seuil introuvable." });
    }

    // Supprimer le milestone en utilisant la méthode Mongoose
    milestone.remove();
    await envelope.save();

    res.status(200).json(envelope);
  } catch (err) {
    console.error("Erreur lors de la suppression du seuil:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Calculer le total d'argent et l'argent disponible
exports.getFinancialSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // Récupérer tous les comptes
    const accounts = await Account.find({ user: userId });

    // Calculer le total dans les comptes
    const totalAccounts = accounts.reduce(
      (acc, account) => acc + account.balance,
      0
    );

    // Récupérer toutes les enveloppes
    const envelopes = await Envelope.find({ user: userId });

    // Calculer le total alloué aux enveloppes
    const totalAllocated = envelopes.reduce(
      (acc, envelope) => acc + envelope.amount,
      0
    );

    // Calculer l'argent disponible
    const availableMoney = totalAccounts - totalAllocated;

    res.status(200).json({
      totalAccounts,
      totalAllocated,
      availableMoney: availableMoney >= 0 ? availableMoney : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
