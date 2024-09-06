const express = require("express");
const app = express();
const Message = require("../models/Message");

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

module.exports = app;
