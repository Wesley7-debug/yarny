import { config } from "dotenv";
import authRoutes from "./router/authRoutes.js";
import profileRoutes from "./router/profileRoutes.js";
import messageRoutes from "./router/messageRoutes.js";
import friendRoutes from "./router/friendRoutes.js";
import groupRoutes from "./router/groupRoutes.js";
import ConnectDb from "../Db/ConnectDb.js";
import { app, server } from "../sockets/socket.js";
import cors from "cors";
import express from "express";

config();

app.use(express.json());

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
//authentication routes
app.use("/api/auth", authRoutes);
//profile routes
app.use("/api/profile", profileRoutes);
//messages routes
app.use("/api/message", messageRoutes);
//friens routes
app.use("/api/friends", friendRoutes);
//group routes
app.use("/api/group", groupRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  ConnectDb();
  console.log(`Server running on http://localhost:${PORT}`);
});
