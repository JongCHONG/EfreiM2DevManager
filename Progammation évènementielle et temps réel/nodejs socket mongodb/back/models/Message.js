// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  dateEnvoi: { type: Date, default: Date.now },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
