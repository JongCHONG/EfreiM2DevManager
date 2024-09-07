import React, { useRef, useEffect } from "react";
import { scrollToBottom } from "../helpers";
import Textarea from "../components/Textarea";

const GlobalMessages = ({ user, socket, globalChatMessages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [globalChatMessages]);

  const sortedGlobalMessages = globalChatMessages.sort(
    (a, b) => a.date - b.date
  );

  return (
    <div className="message-container">
      <div className="messages">
        {sortedGlobalMessages?.map((msg, index) => (
          <div
            key={index}
            className="chatbox"
            style={{
              justifyContent: msg.socketId === user.socketId && "flex-end",
            }}
          >
            <div className="message-text" key={index}>
              <strong>{msg.username}</strong>
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
      <Textarea socket={socket} user={user} />
    </div>
  );
};

export default GlobalMessages;
