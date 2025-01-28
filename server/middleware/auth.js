// server/middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé : token manquant." });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé : format du token invalide." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
