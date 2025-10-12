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
const onlineUsers = new Set();
const disconnectTimers = {};

export function getReceiverSocketIds(userId) {
  return userSocketMap[userId] || [];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) {
    console.warn("❌ No userId in socket handshake query");
    return;
  }

  console.log(`✅ User connected: ${userId} (${socket.id})`);

  if (disconnectTimers[userId]) {
    clearTimeout(disconnectTimers[userId]);
    delete disconnectTimers[userId];
    console.log(`⏹️ Cancelled disconnect timer for ${userId}`);
  }

  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }
  userSocketMap[userId].push(socket.id);
  onlineUsers.add(userId);

  io.emit("getOnlineUsers", Array.from(onlineUsers));

  // Handlers

  socket.on("friendsCalling", ({ targetUserId, from, callType }) => {
    const targetSocketIds = getReceiverSocketIds(targetUserId);
    if (targetSocketIds.length === 0) {
      console.warn(
        `❌ Cannot send call notification. No sockets for ${targetUserId}`
      );
      return;
    }
    targetSocketIds.forEach((socketId) => {
      io.to(socketId).emit("friendsCalling", { from, callType });
    });
    console.log(
      `📞 Notified ${targetUserId} of ${callType} call from ${from.id}`
    );
  });

  socket.on("call-user", ({ offer, targetUserId, from }) => {
    const targetSocketIds = getReceiverSocketIds(targetUserId);
    if (targetSocketIds.length === 0) {
      console.warn(`❌ No sockets for user ${targetUserId} to deliver call`);
      return;
    }
    targetSocketIds.forEach((socketId) => {
      io.to(socketId).emit("receive-call", { offer, from });
    });
    console.log(`📞 Emitted call offer to ${targetUserId} from ${from.id}`);
  });

  socket.on("call-declined", ({ to }) => {
    if (!to) {
      console.warn("call-declined: missing 'to' field");
      return;
    }
    const targetSocketIds = getReceiverSocketIds(to);
    if (targetSocketIds.length === 0) {
      console.warn(`❌ Cannot notify ${to} — no active sockets`);
      return;
    }
    targetSocketIds.forEach((socketId) => {
      io.to(socketId).emit("call-declined");
    });
    console.log(`🚫 Notified ${to} of call decline`);
  });

  socket.on("answer-call", ({ answer, to }) => {
    if (!to) {
      console.warn("answer-call: missing 'to' field");
      return;
    }
    const targetSocketIds = getReceiverSocketIds(to);
    targetSocketIds.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("call-answered", { answer });
      }
    });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (!to) {
      console.warn("ice-candidate: missing 'to' field");
      console.log("ice found", candidate);
      return;
    }
    // Assuming `to` here is socketId (not userId)
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("end-call", ({ roomId }) => {
    if (!roomId) {
      console.warn("end-call: missing 'roomId'");
      return;
    }
    const targetSocketIds = getReceiverSocketIds(roomId);
    targetSocketIds.forEach((socketId) => {
      io.to(socketId).emit("end-call");
    });
  });

  socket.on("logout", () => {
    console.log(`🔌 User ${userId} logged out`);
    if (userSocketMap[userId]) {
      userSocketMap[userId].forEach((sid) => {
        const s = io.sockets.sockets.get(sid);
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

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id} for user ${userId}`);
    if (userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (sid) => sid !== socket.id
      );
      if (userSocketMap[userId].length === 0) {
        disconnectTimers[userId] = setTimeout(() => {
          delete userSocketMap[userId];
          onlineUsers.delete(userId);
          delete disconnectTimers[userId];
          io.emit("getOnlineUsers", Array.from(onlineUsers));
          console.log(`⚠️ User ${userId} removed after disconnect timeout`);
        }, 10000);
      }
    }
  });
});

export { io, app, server };
