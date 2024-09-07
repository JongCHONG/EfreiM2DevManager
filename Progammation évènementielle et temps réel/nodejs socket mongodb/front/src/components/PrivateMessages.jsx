import React, { useState, useEffect, useRef } from "react";
import {
  getUserbySocketId,
  scrollToBottom,
  sortAndFilterPrivatesMessages,
} from "../helpers";
import Textarea from "./Textarea";

const PrivateMessages = ({
  user,
  selectedUser,
  allMessages,
  onSendMessage,
}) => {
  const [to, setTo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [allMessages]);

  useEffect(() => {
    const fetchUserId = async () => {
      const selectedUserInfos = await getUserbySocketId(selectedUser.socketId);
      setTo(selectedUserInfos);
    };

    if (selectedUser.socketId !== "") {
      fetchUserId();
    }
  }, [selectedUser]);

  const sortedAndfilteredPrivateMessages = sortAndFilterPrivatesMessages(
    allMessages,
    user,
    to
  );

  return (
    <div className="message-container">
      <div className="messages">
        {sortedAndfilteredPrivateMessages?.map((msg, index) => (
          <div
            key={index}
            className="chatbox"
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
      <Textarea onSendMessage={onSendMessage} selectedUser={selectedUser} />
    </div>
  );
};

export default PrivateMessages;
