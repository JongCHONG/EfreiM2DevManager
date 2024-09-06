const express = require("express");
const app = express();
const Message = require("../models/Message");

// Route pour récupérer les messages entre deux utilisateurs
app.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, recieverId: user2 },
        { senderId: user2, recieverId: user1 },
      ],
    })
      .populate("senderId")
      .populate("recieverId")
      .sort({ dateSent: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route pour récupérer un message par son ID
app.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id)
      .populate("senderId")
      .populate("recieverId");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
