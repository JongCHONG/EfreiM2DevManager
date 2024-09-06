import axios from 'axios';

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
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
}