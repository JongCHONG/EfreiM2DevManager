import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import "./App.css";
import logo from "../src/assets/logo.jpeg";
import Message from "./components/Message";

import io from "socket.io-client";
const socket = io("http://localhost:5000/"); // Remplacez par l'URL de votre serveur

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function App() {
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connecté au serveur");
    });

    socket.on("userRegistered", (user) => {
      setIsRegistered(true);
      console.log("Utilisateur enregistré:", user);
    });

    socket.on("registrationError", (error) => {
      console.error("Erreur d'enregistrement:", error);
    });

    socket.on("usersList", (users) => {
      setUsersList(users);
    });

    return () => {
      socket.off("connect");
      socket.off("userRegistered");
      socket.off("registrationError");
      socket.off("usersList");
    };
  }, []);

  const handleRegister = () => {
    if (username.trim()) {
      socket.emit("register", username);
    }
  };

  console.log(usersList);
  return (
    <div className="App">
      <img src={logo} alt="logo" className="logo"/>
      SocketRoom
      {!isRegistered ? (
        <div>
          <input
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleRegister}>S'inscrire</button>
        </div>
      ) : (
        <div>
          <h2>Bienvenue, {username}!</h2>
          <Message />
          <h2>Utilisateurs connectés :</h2>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={3000}
          >
            {usersList.map((user, index) => (
              <div key={index} className="carousel-item">
                <h3>{user}</h3>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}

export default App;
