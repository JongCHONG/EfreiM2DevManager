import axios from "axios";

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const getUserbySocketId = async (socketId) => {
  const response = await axios.get(
    `http://localhost:5000/users/getUserBySocketId/${socketId}`
  );
  return response.data;
};

export const scrollToBottom = (messagesEndRef) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

export const sortAndFilterPrivatesMessages = (messages, user, to) => {
  messages.sort((a, b) => new Date(a.dateSent) - new Date(b.dateSent));
  messages?.filter(
    (message) =>
      (message.senderId?._id === user?.id &&
        message.receiverId?._id === to?._id) ||
      (message.senderId?._id === to?._id &&
        message.receiverId?._id === user?.id)
  );
  return messages;
};
