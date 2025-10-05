import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: [socketId1, socketId2, ...] }
const onlineUsers = new Set(); // set of online userIds
const disconnectTimers = {}; // { userId: Timeout }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]?.[0];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.warn("❌ No userId in socket handshake query");
    return;
  }

  console.log(`✅ User connected: ${userId} (${socket.id})`);

  // ✅ Cancel any pending disconnect timeout
  if (disconnectTimers[userId]) {
    clearTimeout(disconnectTimers[userId]);
    delete disconnectTimers[userId];
    console.log(
      `⏹️ Reconnected - cancel disconnect timeout for user ${userId}`
    );
  }

  // ✅ Add socket to user's socket list
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }
  userSocketMap[userId].push(socket.id);

  // ✅ Mark user online
  onlineUsers.add(userId);

  // ✅ Broadcast online users list
  io.emit("getOnlineUsers", Array.from(onlineUsers));

  // ✅ Join conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // ✅ Typing event
  socket.on("typing", ({ conversationId, userId }) => {
    console.log(
      `➡️ Received typing from ${userId} in conversation ${conversationId}`
    );
    socket.to(conversationId).emit("userTyping", { conversationId, userId });
  });

  socket.on("stopTyping", ({ conversationId, userId }) => {
    socket
      .to(conversationId)
      .emit("userStoppedTyping", { conversationId, userId });
  });

  // ✅ Handle logout
  socket.on("logout", () => {
    console.log(`🔌 User ${userId} logged out`);

    // Disconnect all sockets for this user
    if (userSocketMap[userId]) {
      userSocketMap[userId].forEach((socketId) => {
        const s = io.sockets.sockets.get(socketId);
        if (s) s.disconnect(true);
      });
      delete userSocketMap[userId];
    }

    onlineUsers.delete(userId);

    if (disconnectTimers[userId]) {
      clearTimeout(disconnectTimers[userId]);
      delete disconnectTimers[userId];
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers));
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id} for user ${userId}`);

    if (userSocketMap[userId]) {
      // Remove the disconnected socket
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      // If user has no remaining sockets, start timeout
      if (userSocketMap[userId].length === 0) {
        console.log(`⏳ Starting disconnect timeout for user ${userId}`);
        disconnectTimers[userId] = setTimeout(() => {
          console.log(`⚠️ User ${userId} timed out - marking offline`);

          delete userSocketMap[userId];
          onlineUsers.delete(userId);
          delete disconnectTimers[userId];

          io.emit("getOnlineUsers", Array.from(onlineUsers));
        }, 10000); // 10 seconds
      }
    }
  });
});

export { io, app, server };
