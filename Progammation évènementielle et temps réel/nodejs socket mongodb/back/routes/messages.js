const express = require("express");
const app = express();
const Message = require("../models/Message");

// Route pour récupérer les messages entre deux utilisateurs
app.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    })
      .populate("senderId")
      .populate("receiverId")
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
      .populate("receiverId");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route pour envoyer un message
app.post("/", async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      dateSent: new Date(),
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
