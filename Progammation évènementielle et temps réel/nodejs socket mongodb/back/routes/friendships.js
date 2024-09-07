const express = require("express");
const app = express();
const Friendship = require("../models/Friendship");

app.get("/check", async (req, res) => {
  const { userId1, userId2 } = req.query;
  try {
    const friends = await Friendship.findOne({
      $or: [
        { requester: userId1, recipient: userId2 },
        { requester: userId2, recipient: userId1 },
      ],
      status: "accepted",
    });
    res.json({ friends });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
