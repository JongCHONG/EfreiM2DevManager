import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { SocketContext } from "../contexts/SocketContext";
import { UserContext } from "../contexts/UserContext";


const Subscription = ({setShowChat}) => {
  const socket = useContext(SocketContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    socket.on("registrationError", (errorMessage) => {
      toast.error(errorMessage);
    });

    return () => {
      socket.off("registrationError");
    };
  }, [socket]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = () => {
    if (!username.trim()) {
      toast.error("Le nom d'utilisateur est requis.");
      return;
    }
    if (!email.trim()) {
      toast.error("L'email est requis.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("L'email n'est pas valide.");
      return;
    }
    if (!password.trim()) {
      toast.error("Le mot de passe est requis.");
      return;
    }

    socket.emit("register", { username, email, password });
  };

  socket.on("userRegistered", (user) => {
    setShowChat(true);
    setUser(user);
    console.log("Utilisateur enregistré:", user);
  });

  return (
    <>
      <div>
        <h1 className="title">Inscription</h1>
      </div>
      <div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingUsername"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="floatingUsername">Nom d'utilisateur</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingEmail">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPasswordSubcription"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPasswordSubcription">Mot de passe</label>
        </div>
        <button className="btn btn-primary" onClick={handleRegister}>
          S'inscrire
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Subscription;
