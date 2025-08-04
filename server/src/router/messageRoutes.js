import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  deleteMessage,
  editMessage,
  getorcreateMessage,
  sendMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/", requireAuth, getorcreateMessage);
router.post("/send/:id", requireAuth, sendMessage);
router.put("/edit/:id", requireAuth, editMessage);
router.delete("/delete/:id", requireAuth, deleteMessage);
export default router;
