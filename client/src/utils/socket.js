// src/utils/socket.js
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket && userId) {
    socket = io(SERVER_URL, {
      autoConnect: true,
      withCredentials: true,
      query: { userId },
    });
  }
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
