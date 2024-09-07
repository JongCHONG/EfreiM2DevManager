import React, { useState, useEffect } from "react";
import axios from "axios";

import { getRandomColor, getUserbySocketId } from "../helpers";

import FriendRequest from "../components/FriendRequest";

const SidePanel = ({ socket, user, setSelectedUser, setAllMessages }) => {
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socket.on("connectedUsers", (users) => {
      setConnectedUsers(users);
    });

    return () => {
      socket.off("connectedUsers");
    };
  }, [socket]);

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

  return (
    <div className="left me-4 pe-4 border-end" style={{ width: "25%" }}>
      <h2 className="title mb-4">SocketChat</h2>
      <div
        className="user d-flex align-items-center mb-2"
        onClick={() =>
          setSelectedUser({
            username: "",
            socketId: "",
          })
        }
      >
        <div className="circle" style={{ backgroundColor: getRandomColor() }}>
          {"c".charAt(0).toUpperCase()}
        </div>
        <h3 className="truncate">ChatRoom</h3>
      </div>
      {connectedUsers?.map((userOnLine, index) => (
        <div
          key={index}
          className="user d-flex align-items-center mb-2"
          onClick={() =>
            handleUserClick(userOnLine.username, userOnLine.socketId)
          }
        >
          <div className="circle" style={{ backgroundColor: getRandomColor() }}>
            {userOnLine.username.charAt(0).toUpperCase()}
          </div>
          <h3 className="truncate">
            {userOnLine.username}
            {userOnLine.socketId !== user.socketId && (
              <FriendRequest
                userId={user.id}
                friendSocketId={userOnLine.socketId}
              />
            )}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default SidePanel;
