import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Join user to their rooms (1-1 or group conversations)
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Handle typing start
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("userTyping", { conversationId, userId });
  });

  // Handle typing stop
  socket.on("stopTyping", ({ conversationId, userId }) => {
    socket
      .to(conversationId)
      .emit("userStoppedTyping", { conversationId, userId });
  });

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
