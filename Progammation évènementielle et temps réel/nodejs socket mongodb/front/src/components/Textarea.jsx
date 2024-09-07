import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const Textarea = ({ user, socket, onSendMessage, selectedUser }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    onSendMessage(message);
    setMessage("");
  };

  const sendGlobalMessage = () => {
    socket.emit("sendGlobalMessage", { username: user.username, message });
    setMessage("");
  };

  return (
    <div className="message-box">
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Leave a comment here"
          id="floatingTextarea2"
          onChange={(e) => setMessage(e.target.value)}
          style={{ height: "100px" }}
          value={message}
        />
        <label htmlFor="floatingTextarea2">
          {selectedUser?.username
            ? "Envoyer un message à " + selectedUser.username
            : "Parler dans le Chatroom"}
        </label>
      </div>
      <Button onClick={selectedUser ? handleSendMessage : sendGlobalMessage}>
        Envoyer
      </Button>
    </div>
  );
};

export default Textarea;
