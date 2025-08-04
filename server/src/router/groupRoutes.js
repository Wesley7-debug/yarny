import express from "express";

import { requireAuth } from "../middlewares/requireAuth.js";
import { generateGroupInviteLink } from "../controllers/groupControllers.js";

const router = express.Router();

// Create an invite link
router.post(
  "/groups/:groupId/invite-link",
  requireAuth,
  generateGroupInviteLink
);

// Join group via invite link token
router.post("/groups/join/:token", requireAuth, joinGroupByInviteLink);
export default router;
