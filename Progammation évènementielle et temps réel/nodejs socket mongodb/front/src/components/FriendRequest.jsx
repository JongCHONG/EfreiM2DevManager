import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { getUserbySocketId } from "../helpers";
import { SocketContext } from "../contexts/SocketContext";

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
      console.log("cioucou");
      
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
    <div>
      <Button onClick={sendFriendRequest} disabled={status !== "idle"}>
        {status === "idle" && "Add Friend"}
        {status === "pending" && "Request Sent"}
        {status === "received" && "Request Received"}
        {status === "accepted" && "Friend Added"}
      </Button>
      {status === "received" && (
        <Button onClick={acceptFriendRequest}>
          Accept Friend Request
        </Button>
      )}
    </div>
  );
};

export default FriendRequest;