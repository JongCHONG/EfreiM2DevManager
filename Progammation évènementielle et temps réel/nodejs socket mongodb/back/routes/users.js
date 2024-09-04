const express = require("express")
const app = express()
const User = require('../models/User'); 

// Route pour ajouter un utilisateur
app.post('/addUser', async (req, res) => {
  const { username } = req.body;
  try {
    const user = new User({ username });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});