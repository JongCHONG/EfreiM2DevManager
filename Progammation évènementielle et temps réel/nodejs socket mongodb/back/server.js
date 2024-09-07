const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const { join } = require("node:path");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Importer bcrypt
const Message = require("./models/Message");
const User = require("./models/User");
const Friendship = require("./models/Friendship");

require("dotenv").config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
  },
});
const dbName = process.env.DB_NAME;
const connectedUsers = {};

app.use(
  cors({
    origin: `http://localhost:3000`,
  })
);

app.use(express.json());

const usersRoutes = require("./routes/users");
const messagesRoutes = require("./routes/messages");
const friendshipsRoutes = require("./routes/friendships");
app.use("/users", usersRoutes);
app.use("/messages", messagesRoutes);
app.use("/friendships", friendshipsRoutes);

//avec ça on accede à page client.html via localhost:3000
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "client.html"));
});

mongoose.set("strictQuery", false);

// Connexion à MongoDB
mongoose.connect(`${process.env.MONGODB}${dbName}`);

// Vérifier la connexion à MongoDB
mongoose.connection.on("connected", () => {
  console.log(`Connecté à MongoDB, base de données: ${dbName}`);
});

mongoose.connection.on("error", (err) => {
  console.log("Erreur de connexion à MongoDB:", err);
});

// Gérer les connexions Socket.IO
io.on("connection", (socket) => {
  console.log("Connecté au serveur socket");

  socket.on("register", async ({ username, email, password }) => {
    console.log(
      `L'utilisateur ${socket.id} s'est inscrit sous le nom de ${username}`
    );
    try {
      let user = await User.findOne({ username });
      if (user) {
        socket.emit("registrationError", "Le nom d'utilisateur existe déjà.");
        return;
      }

      user = await User.findOne({ email });
      if (user) {
        socket.emit("registrationError", "L'email existe déjà.");
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hacher le mot de passe

      user = new User({ username, email, password: hashedPassword, socketId: socket.id });
      await user.save();

      // Ajoutez l'utilisateur à la liste des utilisateurs connectés
      connectedUsers[socket.id] = { username, socketId: socket.id };
      socket.emit("userRegistered", {
        id: user._id,
        username: user.username,
        email: user.email,
        socketId: user.socketId,
      });
      io.emit("connectedUsers", Object.values(connectedUsers));
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", err);
      socket.emit("registrationError", err.message);
    }
  });

  socket.on("login", async ({ email, password }) => {
    console.log(
      `L'utilisateur ${socket.id} s'est connecté avec l'email ${email}`
    );
    try {
      const user = await User.findOne({ email });
      if (!user) {
        socket.emit("loginError", "L'utilisateur n'existe pas.");
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password); // Comparer le mot de passe haché
      if (!isPasswordValid) {
        socket.emit("loginError", "Email ou mot de passe incorrect.");
        return;
      }

      user.socketId = socket.id;
      await user.save();

      connectedUsers[socket.id] = {
        username: user.username,
        socketId: socket.id,
      };
      socket.emit("userLoggedIn", {
        id: user._id,
        username: user.username,
        email: user.email,
        socketId: user.socketId,
      });
      io.emit("connectedUsers", Object.values(connectedUsers));
    } catch (err) {
      console.error("Erreur lors de la connexion de l'utilisateur:", err);
      socket.emit("loginError", err.message);
    }
  });

  socket.on("addUser", async (username) => {
    connectedUsers[socket.id] = { username, socketId: socket.id };

    try {
      await User.findOneAndUpdate(
        { username: username },
        { socketId: socket.id },
        { upsert: true, new: true }
      );
      console.log(`Mise à jour du socketId pour l'utilisateur ${username}`);
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du socketId pour l'utilisateur ${username}:`,
        error
      );
    }

    io.emit("connectedUsers", Object.values(connectedUsers));
  });

  socket.on("sendMessage", async ({ to, from, message }) => {
    try {
      const sender = await User.findOne({ socketId: from });
      if (!sender) {
        console.error("Sender not found");
        return;
      }

      const receiver = await User.findOne({ socketId: to });
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }

      let newMessage = new Message({
        message,
        senderId: sender._id,
        receiverId: receiver._id,
        dateSent: new Date(),
      });

      await newMessage.save();
      console.log("Message saved to database");

      io.to(to).emit("receiveMessage", newMessage._id);
      if (from !== to) {
        io.to(from).emit("receiveMessage", newMessage._id);
      }
    } catch (error) {
      console.error("Error processing sendMessage event:", error);
    }
  });

  socket.on("disconnectUser", async (socketId) => {
    console.log(`L'utilisateur avec socketId ${socketId} se déconnecte`);
    try {
      await User.findOneAndUpdate({ socketId: socketId }, { socketId: null });
      console.log(
        `Mise à jour du socketId pour l'utilisateur avec socketId ${socketId}`
      );
      socket.disconnect(true); // Déconnecter le socket
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du socketId pour l'utilisateur avec socketId ${socketId}:`,
        error
      );
    }
  });

  socket.on("disconnect", () => {
    console.log(`Déconnecté du serveur socket`);
    if (connectedUsers[socket.id]) {
      delete connectedUsers[socket.id];
    }
    io.emit("connectedUsers", Object.values(connectedUsers));
  });

  socket.on("sendFriendRequest", async ({ from, to }) => {
    try {
      const requester = await User.findOne({ _id: from });
      const recipient = await User.findOne({ _id: to });
     
      if (!requester || !recipient) {
        console.error("User not found");
        return;
      }
      
      let newFriendship = new Friendship({
        requester: requester._id,
        recipient: recipient._id,
      });

      await newFriendship.save();
      console.log("Friend request sent");
      
      io.to(recipient.socketId).emit("receiveFriendRequest", newFriendship._id);
    } catch (error) {
      console.error("Error processing sendFriendRequest event:", error);
    }
  });

  socket.on("acceptFriendRequest", async ({ requestId }) => {
    try {
      let friendship = await Friendship.findById(requestId);

      const requesterSocketId = await User.findOne({ _id: friendship.requester });
      const recipientSocketId = await User.findOne({ _id: friendship.recipient });

      if (!friendship) {
        console.error("Friend request not found");
        return;
      }

      friendship.status = "accepted";
      await friendship.save();
      console.log("Friend request accepted")     
      
      io.to(requesterSocketId.socketId).emit("friendRequestAccepted", friendship._id);
      io.to(recipientSocketId.socketId).emit("friendRequestAccepted", friendship._id);
    } catch (error) {
      console.error("Error processing acceptFriendRequest event:", error);
    }
  });

  socket.on("sendGlobalMessage", ({ username, message }) => {
    io.emit("receiveGlobalMessage", { username, message, socketId: socket.id, dateSent: new Date(), });
  });

});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});