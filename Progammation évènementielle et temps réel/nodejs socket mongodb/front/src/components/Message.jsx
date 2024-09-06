import React, { useState, useEffect, useRef, useContext } from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { UserContext } from "../contexts/UserContext";
import { getUserbySocketId } from "../helpers";

const Message = ({ selectedUser, allMessages, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [to, setTo] = useState(null);
  const { username } = selectedUser;
  const messagesEndRef = useRef(null);
  const { user } = useContext(UserContext);

  const handleSendMessage = () => {
    onSendMessage(message);
    setMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const sortedAllMessages = allMessages.sort(
    (a, b) => new Date(a.dateSent) - new Date(b.dateSent)
  );

  useEffect(() => {
    const fetchUserId = async () => {
      const selectedUserInfos = await getUserbySocketId(selectedUser.socketId);
      setTo(selectedUserInfos);
    };

    if (selectedUser.socketId !== "") {
      fetchUserId();
    }
  }, [selectedUser]);

  const filteredMessages = sortedAllMessages.filter(
    (message) =>
      message.senderId._id === user.id && message.recieverId._id === to._id
  );

  console.log("filteredMessages", filteredMessages);

  // console.log("user", user);
  // console.log("to", to);
  console.log("allMessages", allMessages);

  return (
    <div className="message-container">
      {filteredMessages.map((msg, index) => (
        <div key={index}>
          <div style={{ textAlign: msg.senderId._id === user.id && "right" }}>
            <strong>{msg.senderId.username}</strong>:{msg.message}
            <div>
              <small>{new Date(msg.dateSent).toLocaleString()}</small>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
      <div className="message-box">
        <h3>Envoyer un message à {username}</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          cols="50"
        />
        <Button onClick={handleSendMessage}>Envoyer</Button>
      </div>
    </div>
  );
};

export default Message;
