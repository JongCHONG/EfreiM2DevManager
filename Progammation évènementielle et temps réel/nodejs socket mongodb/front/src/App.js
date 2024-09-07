import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import "./App.css";
import logo from "../src/assets/logo.jpeg";

import PrivateMessages from "./components/PrivateMessages";
import Subscription from "./components/Subscription";
import Login from "./components/Login";
import SidePanel from "./components/SidePanel";
import GlobalMessages from "./components/GlobalMessages";

import { SocketContext } from "./contexts/SocketContext";
import { UserContext } from "./contexts/UserContext";

function App() {
  const socket = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    socketId: "",
  });
  const [allMessages, setAllMessages] = useState([]);
  const [globalChatMessages, setGlobalChatMessages] = useState([]);

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

    socket.on("receiveGlobalMessage", (data) => {
      const { username, message, socketId, dateSent } = data;
      setGlobalChatMessages((prevMessages) => [
        ...prevMessages,
        { username, message, socketId, dateSent },
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveGlobalMessage");
      socket.off("receiveMessage");
      socket.off("connectedUsers");
    };
  }, [socket, setUser]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAllMessages([]);
    setGlobalChatMessages([]);
    setSelectedUser({ username: "", socketId: "" });
    socket.emit("disconnectUser", user.socketId);
    setTimeout(() => {
      socket.connect();
    }, 1000);
  };

  const handleSendMessage = (message) => {
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
            <SidePanel
              socket={socket}
              user={user}
              setSelectedUser={setSelectedUser}
              setAllMessages={setAllMessages}
            />
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
              {selectedUser.socketId !== "" ? (
                <PrivateMessages
                  user={user}
                  selectedUser={selectedUser}
                  allMessages={allMessages}
                  onSendMessage={handleSendMessage}
                  globalChatMessages={globalChatMessages}
                />
              ) : (
                <>
                  <GlobalMessages
                    user={user}
                    socket={socket}
                    globalChatMessages={globalChatMessages}
                  />
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default App;
