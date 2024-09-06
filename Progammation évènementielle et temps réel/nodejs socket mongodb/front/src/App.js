import React, { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
import Button from "react-bootstrap/Button";

import { getRandomColor } from "./helpers";

function App() {
  const [usersList, setUsersList] = useState([]);
  const socket = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    socketId: "",
  });
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

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

    socket.on("receiveMessage", async ({ from, message, dateSent }) => {
      console.log(`Message from ${from}: ${message}`);

      try {
        const response = await axios.get(`http://localhost:5000/users/${from}`);
        const sender = response.data;

        setReceivedMessages((prevMessages) => [
          ...prevMessages,
          { from: sender.username, message, dateSent },
        ]);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    });

    return () => {
      socket.off("connect");
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
    socket.emit("disconnectUser", user.socketId);
    setTimeout(() => {
      socket.connect();
    }, 1000);
  };

  const handleUserClick = async (username, socketId) => {
    setSelectedUser({ username, socketId });
    // setReceivedMessages([]);
    // setSentMessages([]);

    try {
      const reciever = await axios.get(
        `http://localhost:5000/users/getUserBySocketId/${socketId}`
      );
      const response = await axios.get(
        `http://localhost:5000/messages/${user.id}/${reciever.data._id}`
      );
      const messages = response.data;

      const received = messages.filter((msg) => msg.recieverId._id === user.id);
      const sent = messages.filter((msg) => msg.senderId._id === user.id);

      setReceivedMessages(received);
      setSentMessages(sent);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", {
        to: selectedUser.socketId,
        from: user.socketId,
        message,
      });
      setSentMessages((prevMessages) => [
        ...prevMessages,
        { to: selectedUser.username, message, dateSent: new Date() },
      ]);
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
        <div className="pt-5">
          <Container className="d-flex">
            <div className="left" style={{ width: "25%" }}>
              <h2 className="title">Utilisateurs en ligne</h2>
              {usersList?.map((userOnLine, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mb-2"
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

              <Message
                selectedUser={selectedUser}
                receivedMessages={receivedMessages}
                sentMessages={sentMessages}
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
