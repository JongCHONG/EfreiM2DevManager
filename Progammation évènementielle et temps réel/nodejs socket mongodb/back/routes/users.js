const express = require("express");
const app = express();
const User = require("../models/User");
const mongoose = require("mongoose");

// Route pour ajouter un utilisateur
app.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route pour obtenir un utilisateur par socket ID
app.get("/getUserBySocketId/:socketId", async (req, res) => {
  const { socketId } = req.params;

  try {
    const user = await User.findOne({ socketId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route pour obtenir la liste des utilisateurs
app.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Récupérer tous les utilisateurs connectés (socketId != null)
app.get("/connected-users", async (req, res) => {
  try {
    // Rechercher tous les utilisateurs avec socketId différent de null
    const connectedUsers = await User.find({ socketId: { $ne: null } });
    res.json(connectedUsers);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des utilisateurs connectés");
  }
});

module.exports = app;
