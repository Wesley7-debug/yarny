import express from "express";

import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// Create an invite link
router.post(
  "/groups/:groupId/invite-link",
  authenticate,
  generateGroupInviteLink
);

// Join group via invite link token
router.post("/groups/join/:token", authenticate, joinGroupByInviteLink);
export default router;
