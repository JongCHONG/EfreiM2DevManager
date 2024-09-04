import React, { useState, useEffect, useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import "./App.css";
import logo from "../src/assets/logo.jpeg";

import Message from "./components/Message";
import Subscription from "./components/Subscription";
import Login from "./components/Login";

import { SocketContext } from "./contexts/SocketContext";
import { UserContext } from "./contexts/UserContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
  const [isRegistered, setIsRegistered] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const socket = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connecté au serveur");
    });

    socket.on("userRegistered", (user) => {
      setIsRegistered(true);
      setUser(user);
      console.log("Utilisateur enregistré:", user);
    });

    socket.on("usersList", (users) => {
      setUsersList(users);
    });

    return () => {
      socket.off("connect");
      socket.off("userRegistered");
      socket.off("usersList");
    };
  }, [socket, setUser]);

  console.log(usersList);
  return (
    <div className="App">
      {!isRegistered ? (
        <Container>
          <Row className="align-items-center">
            <Col xs={12} lg={4}>
              <Login />
            </Col>
            <Col
              xs={12}
              lg={4}
              className="d-flex flex-column align-items-center justify-content-center"
            >
              <img src={logo} alt="logo" className="logo" />
              <h1 className="title">SocketChat</h1>
            </Col>
            <Col xs={12} lg={4}>
              <Subscription />
            </Col>
          </Row>
        </Container>
      ) : (
        <div>
          <h2>Bienvenue, {user && user.username}!</h2>
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
