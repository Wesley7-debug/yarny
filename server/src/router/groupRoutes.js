import express from "express";

import { requireAuth } from "../middlewares/requireAuth.js";
import {
  acceptGroupInvitation,
  addUserToGroup,
  createGroup,
  deleteGroup,
  deleteGroupMessage,
  exitGroup,
  generateGroupInviteLink,
  getGroupInfo,
  getGroupMessages,
  getUserGroups,
  joinGroupByInviteLink,
  rejectGroupInvitation,
  sendMessageToGroup,
} from "../controllers/groupControllers.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//get all group
router.get("/", requireAuth, getUserGroups);
//get a single group message
router.get("/:groupId/messages", requireAuth, getGroupMessages);
//get group info
router.get("/:groupId/info", requireAuth, getGroupInfo);

//CREATE GROUP
router.post(
  "/create-group",
  requireAuth,
  upload.single("groupAvatar"),

  createGroup
);
router.delete("/delete/:groupId", requireAuth, deleteGroup);
// send message to group
router.post(
  "/:groupId/messages",
  requireAuth,
  upload.array("attachments", 5),

  sendMessageToGroup
);

//delete group message
router.delete("/:groupId/messages/:messageId", requireAuth, deleteGroupMessage);

//acept invitaiton
router.post("/accept-group-invite", requireAuth, acceptGroupInvitation);
//reject invitaion
router.post("/reject-group-invite", requireAuth, rejectGroupInvitation);
//exit group
router.post("/exit-group", requireAuth, exitGroup);
//add single user to group
router.post("/add-user-to-group", requireAuth, addUserToGroup);
// Create an invite link
router.post("/:groupId/invite-link", requireAuth, generateGroupInviteLink);
// Join group via invite link token
router.post("/groups/join/:token", requireAuth, joinGroupByInviteLink);

export default router;
