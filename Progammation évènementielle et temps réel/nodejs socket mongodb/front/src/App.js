import React, { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import "./App.css";
import logo from "../src/assets/logo.jpeg";

import Message from "./components/Message";
import Subscription from "./components/Subscription";
import Login from "./components/Login";
import FriendRequest from "./components/FriendRequest";

import { SocketContext } from "./contexts/SocketContext";
import { UserContext } from "./contexts/UserContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { getRandomColor } from "./helpers";
import { getUserbySocketId } from "../src/helpers"

function App() {
  const [usersList, setUsersList] = useState([]);
  const socket = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    socketId: "",
  });
  const [error, setError] = useState(null);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      socket.emit("addUser", JSON.parse(storedUser).username);
    }
    setIsLoading(false);

    socket.on("connect", () => {
      console.log("Connecté au serveur");
    });

    socket.on("connectedUsers", (users) => {
      setUsersList(users);
    });

    socket.on("receiveMessage", async (newMessageId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/${newMessageId}`
        );
        setAllMessages((prevMessages) => [...prevMessages, response.data]);
      } catch (error) {
        console.error("Erreur:", error);
      }
    });

    if (error) {
      toast.error(error);
    }

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("connectedUsers");
    };
  }, [socket, setUser, error]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAllMessages([]);
    setSelectedUser({ username: "", socketId: "" });
    socket.emit("disconnectUser", user.socketId);
    setTimeout(() => {
      socket.connect();
    }, 1000);
  };

  const handleUserClick = async (username, socketId) => {
    setSelectedUser({ username, socketId });

    try {      
      const receiver = await getUserbySocketId(socketId);           
      const response = await axios.get(
        `http://localhost:5000/messages/${user.id}/${receiver._id}`
      );
      setAllMessages(response.data);

    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = (message) => {    
    if (!selectedUser.socketId) {
      setError("Veuillez sélectionner un utilisateur");
    }
    if (message.trim() !== "") {
      socket.emit("sendMessage", {
        to: selectedUser.socketId,
        from: user.socketId,
        message,
      });
    }
  };
  return (
    <div className="App">
      {!user ? (
        <div className="home">
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
        </div>
      ) : (
        <div>
          <Container className="d-flex pt-5">
            <div className="left" style={{ width: "25%" }}>
              <h2 className="title mb-4">Utilisateurs en ligne</h2>
              {usersList?.map((userOnLine, index) => (
                <div
                  key={index}
                  className="user d-flex align-items-center mb-2"
                  onClick={() =>
                    handleUserClick(userOnLine.username, userOnLine.socketId)
                  }
                >
                  <div
                    className="circle"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {userOnLine.username.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="truncate">{userOnLine.username}</h3>
                  <FriendRequest
                    userId={user.id}
                    friendSocketId={userOnLine.socketId}
                  />
                </div>
              ))}
            </div>
            <div className="right" style={{ width: "75%" }}>
              <div className="d-flex justify-content-between">
                <h2>
                  <span className="title">Bienvenue</span>,
                  {user && user.username}!
                </h2>
                <Button variant="outline-primary" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </div>
              <ToastContainer />
              <Message
                selectedUser={selectedUser}
                allMessages={allMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default App;
