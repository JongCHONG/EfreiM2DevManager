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

  const filteredMessages = sortedAllMessages?.filter(
    (message) =>
      (message.senderId?._id === user?.id &&
        message.receiverId?._id === to?._id) ||
      (message.senderId?._id === to?._id &&
        message.receiverId?._id === user?.id)
  );

  return (
    <div className="message-container">
      <div className="messages">
        {filteredMessages?.map((msg, index) => (
          <div
            className="test"
            style={{
              justifyContent: msg.senderId._id === user.id && "flex-end",
            }}
          >
            <div className="message-text" key={index}>
              <strong>{msg.senderId.username}</strong>
              <div className="py-2">{msg.message}</div>
              <div className="dateTime">
                <em>
                  Envoyé le {new Date(msg.dateSent).toLocaleDateString()} à{" "}
                  {new Date(msg.dateSent).toLocaleTimeString()}
                </em>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
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
          <label for="floatingTextarea2">Envoyer un message à {username}</label>
        </div>
        <Button onClick={handleSendMessage}>Envoyer</Button>
      </div>
    </div>
  );
};

export default Message;
