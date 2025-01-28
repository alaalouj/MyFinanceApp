// server/config/db.js

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // MONGO_URI est une variable définie dans le .env (ex: mongodb://localhost:27017/financeDB)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB est connecté");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

module.exports = connectDB;
