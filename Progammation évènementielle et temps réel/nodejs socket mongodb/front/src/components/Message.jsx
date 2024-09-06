import React, { useState, useEffect, useRef, useContext } from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { UserContext } from "../contexts/UserContext";

const Message = ({
  selectedUser,
  receivedMessages,
  sentMessages,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
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
  }, [receivedMessages, sentMessages]);

  const allMessages = [...receivedMessages, ...sentMessages].sort(
    (a, b) => new Date(a.dateSent) - new Date(b.dateSent)
  );

  return (
    <div className="message-container">
      {allMessages.map((msg, index) => (
        <div key={index}>
          <div style={{ textAlign: msg.senderId._id === user.id && "right" }}>
            <strong>{msg.senderId.username}</strong>:
            {msg.message}
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
