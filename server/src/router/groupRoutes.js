import express from "express";

import { requireAuth } from "../middlewares/requireAuth.js";
import {
  acceptGroupInvitation,
  addUserToGroup,
  createGroup,
  exitGroup,
  generateGroupInviteLink,
  getUserGroups,
  joinGroupByInviteLink,
  rejectGroupInvitation,
} from "../controllers/groupControllers.js";

const router = express.Router();

//get all group
router.post("/", requireAuth, getUserGroups);
//CREATE GROUP
router.post("/create-group", requireAuth, createGroup);
//acept invitaiton
router.post("/accept-group-invite", requireAuth, acceptGroupInvitation);
//reject invitaion
router.post("/reject-group-invite", requireAuth, rejectGroupInvitation);
//exit group
router.post("/exit-group", requireAuth, exitGroup);
//add single user to group
router.post("/add-user-to-group", requireAuth, addUserToGroup);
// Create an invite link
router.post(
  "/groups/:groupId/invite-link",
  requireAuth,
  generateGroupInviteLink
);
// Join group via invite link token
router.post("/groups/join/:token", requireAuth, joinGroupByInviteLink);

export default router;
