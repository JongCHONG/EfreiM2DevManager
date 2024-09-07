import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { getUserbySocketId } from "../helpers";
import { SocketContext } from "../contexts/SocketContext";
import axios from "axios";

const FriendRequest = ({ userId, friendSocketId }) => {
  const [status, setStatus] = useState("idle");
  const [friendId, setFriendId] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchFriendId = async () => {
      try {
        const friend = await getUserbySocketId(friendSocketId);
        setFriendId(friend._id);
      } catch (error) {
        console.error("Error fetching friend ID:", error);
      }
    };

    if (friendSocketId) {
      fetchFriendId();
    }
  }, [friendSocketId]);

  useEffect(() => {
    const checkFriendship = async () => {
      try {
        const response = await axios.get("http://localhost:5000/friendships/check", {
          params: { userId1: userId, userId2: friendId },
        });
        
        if (response.data.friends) {
          setStatus("accepted");
        }
      } catch (error) {
        console.error("Error checking friendship:", error);
      }
    };

    if (friendId) {
      checkFriendship();
    }
  }, [friendId, userId]);

  const sendFriendRequest = () => {
    if (friendId) {
      socket.emit("sendFriendRequest", { from: userId, to: friendId });
      setStatus("pending");
    }
  };

  const acceptFriendRequest = () => {
    if (requestId) {
      socket.emit("acceptFriendRequest", { requestId });
      setStatus("accepted");
    }
  };

  useEffect(() => {
    const handleReceiveFriendRequest = (requestId) => {
      console.log("Friend request received:", requestId);
      setRequestId(requestId);
      setStatus("received");
    };

    const handleFriendRequestAccepted = (requestId) => {
      console.log("Friend request accepted:", requestId);   
      setStatus("accepted");
    };

    socket.on("receiveFriendRequest", handleReceiveFriendRequest);
    socket.on("friendRequestAccepted", handleFriendRequestAccepted);

    return () => {
      socket.off("receiveFriendRequest", handleReceiveFriendRequest);
      socket.off("friendRequestAccepted", handleFriendRequestAccepted);
    };
  }, [socket]);

  return (
    <div className="d-flex flex-column">
      <Button size="sm" onClick={sendFriendRequest} disabled={status !== "idle"}>
        {status === "idle" && "Ajouter"}
        {status === "pending" && "Demande envoyée"}
        {status === "received" && "Demande reçue"}
        {status === "accepted" && "Ami"}
      </Button>
      {status === "received" && (
        <Button size="sm" onClick={acceptFriendRequest}>
          Accept l'invitation
        </Button>
      )}
    </div>
  );
};

export default FriendRequest;