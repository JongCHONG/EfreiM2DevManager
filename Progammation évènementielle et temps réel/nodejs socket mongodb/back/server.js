const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
const mongoose = require("mongoose");
const { join } = require("node:path");
const cors = require('cors');
const Message = require("./models/Message");
const User = require("./models/User");

require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`, // Autoriser les requêtes depuis votre application React
    methods: ["GET", "POST"]
  }
});
const dbName = process.env.DB_NAME;
const connectedUsers = {};

app.use(cors({
  origin: `http://localhost:${process.env.PORT}` // Autoriser les requêtes depuis votre application React
}));

//avec ça on accede à page client.html via localhost:3000
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "client.html"));
});

const usersRoutes = require("./routes/users");

mongoose.set("strictQuery", false);

// Connexion à MongoDB
mongoose.connect(
  `${process.env.MONGODB}${dbName}`
);

// Vérifier la connexion à MongoDB
mongoose.connection.on("connected", () => {
  console.log(`Connecté à MongoDB, base de données: ${dbName}`);
});

mongoose.connection.on("error", (err) => {
  console.log("Erreur de connexion à MongoDB:", err);
});

// Gérer les connexions Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("register", async (username) => {
    console.log("Un utilisateur est connecté sous le nom de " + username);
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username });
        await user.save();
      }
      connectedUsers[username] = socket.id; // Ajouter l'utilisateur à connectedUsers
      socket.emit("userRegistered", user); // Envoyer une réponse au client
      io.emit("usersList", Object.keys(connectedUsers)); // Notifier tous les clients connectés avec la liste des utilisateurs
    } catch (error) {
      socket.emit("registrationError", error); // Envoyer une erreur au client
    }
  });

  socket.on("privateMessage", (message) => {
    const toSocketId = connectedUsers[message.to];
    console.log("Un message est envoyé à" + message.to);
    if (toSocketId) {
      io.to(toSocketId).emit("privateMessage", {
        from: socket.id,
        text: message.text
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [username, id] of Object.entries(connectedUsers)) {
      if (id === socket.id) {
        delete connectedUsers[username];
        break;
      }
    }
    io.emit("usersList", Object.keys(connectedUsers)); // Notifier tous les clients connectés avec la liste mise à jour des utilisateurs
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
