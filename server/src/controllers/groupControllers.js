import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import crypto from "crypto";
import cloudinary from "../cloudinary/Cloudinary.js";
import streamifier from "streamifier";
import { io } from "../../sockets/socket.js";
import { createInviteToken } from "../../Utils/inviteToken.js";

//get all the geoup the user is in
export const getUserGroups = async (req, res) => {
  console.log("✅ GET /api/group called"); // Add this
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    const groups = await Conversation.find({
      participants: userId,
      isGroup: true,
    })
      .populate("participants", "username nickname _id")
      .populate("admin", "username nickname _id");

    return res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { groupId } = req.params;

  if (!userId || !groupId) {
    return res.status(400).json({ message: "Missing user ID or group ID" });
  }

  try {
    const messages = await Message.find({ conversationId: groupId })
      .populate("senderId", "nickname")
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getGroupInfo = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { groupId } = req.params;

  if (!userId || !groupId) {
    return res.status(400).json({ message: "Missing user ID or group ID" });
  }
  try {
    const group = await Conversation.findOne({
      _id: groupId,
      isGroup: true,
      isDeleted: { $ne: true },
    })
      .populate("participants", "username nickname _id")
      .populate("admin", "username nickname _id");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return only needed fields for FE
    return res.status(200).json({
      _id: group._id,
      name: group.name,
      groupAvatar: group.groupAvatar || null,
      participants: group.participants,
      admin: group.admin,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      inviteTokens: group.inviteTokens || [],
      isGroup: group.isGroup,
    });
  } catch (error) {
    console.error("Error fetching group info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessageToGroup = async (req, res) => {
  console.log("BODY:", req.body); // <--- should show text
  console.log("FILES:", req.files);
  const userId = req.user?.id || req.user?._id;
  const { groupId } = req.params;
  const { text } = req.body;
  console.log("group id", groupId);
  if (!groupId) {
    return res.status(400).json({ message: "group id no dey" });
  }
  if (!text && (!req.files || req.files.length === 0)) {
    console.log("DEBUG: text or files missing", { text, files: req.files });
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    //  Validate group
    const group = await Conversation.findOne({
      _id: groupId,
      isGroup: true,
      isDeleted: { $ne: true },
      participants: userId,
    });

    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });
    }

    // Upload files to Cloudinary
    const attachments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            resource_type: file.mimetype.startsWith("image/") ? "image" : "raw", // PDFs & docs are "raw"
            folder: "group-messages",
          }
        );

        attachments.push({
          url: upload.secure_url,
          public_id: upload.public_id,
          format: upload.format,
          originalname: file.originalname,
          resource_type: upload.resource_type,
        });
      }
    }

    //  Save message
    const newMessage = new Message({
      conversationId: groupId,
      senderId: userId,
      text,
      attachments,
      isGroup: true,
    });

    await newMessage.save();

    // Update group timestamp
    group.updatedAt = new Date();
    await group.save();

    // Populate sender
    await newMessage.populate("senderId", "nickname");

    //  Emit to group via socket

    io.to(groupId).emit("newGroupMessage", newMessage);

    //  Send response
    return res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error("Error sending group message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteGroupMessage = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { groupId, messageId } = req.params;

  try {
    const group = await Conversation.findOne({
      _id: groupId,
      isGroup: true,
      isDeleted: { $ne: true },
      participants: userId,
    });

    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });
    }

    const message = await Message.findOne({
      _id: messageId,
      conversationId: groupId,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Optional: Only sender can delete
    if (String(message.sender) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this message" });
    }

    // If message has Cloudinary attachments, delete them
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        if (attachment.public_id) {
          await cloudinary.uploader.destroy(attachment.public_id, {
            resource_type: attachment.resource_type || "raw",
          });
        }
      }
    }

    await Message.deleteOne({ _id: messageId });

    // Emit to group so all clients remove it

    io.to(groupId).emit("groupMessageDeleted", { messageId });

    return res.status(200).json({ success: true, messageId });
  } catch (error) {
    console.error("Error deleting group message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createGroup = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { name } = req.body;

  let participants = [];

  try {
    // Parse participants (sent as JSON string in FormData)
    if (req.body.participants) {
      participants = JSON.parse(req.body.participants);
    }

    // Basic validation
    if (!userId || !name || participants.length === 0) {
      return res.status(400).json({
        message: "Group name and at least one participant are required.",
      });
    }

    // Normalize participant IDs
    const uniqueParticipantIds = new Set();

    for (const participant of participants) {
      const id =
        typeof participant === "object" ? participant._id : participant;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: `Invalid participant ID: ${id}` });
      }
      uniqueParticipantIds.add(String(id));
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID (creator)." });
    }

    uniqueParticipantIds.add(String(userId));

    const participantObjectIds = Array.from(uniqueParticipantIds).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Upload avatar to Cloudinary
    let groupAvatarUrl = null;
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "group-avatars" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      groupAvatarUrl = result.secure_url;
    }

    // Generate invite token
    const inviteToken = createInviteToken({ expiresAt: 168 });

    const newGroup = new Conversation({
      name,
      isGroup: true,
      participants: participantObjectIds,
      admin: [new mongoose.Types.ObjectId(userId)],
      groupAvatar: groupAvatarUrl,
      inviteTokens: [inviteToken],
    });

    await newGroup.save();

    return res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// DELETE /api/group/:groupId
export const deleteGroup = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { groupId } = req.params;

  if (!userId || !groupId) {
    return res.status(400).json({ message: "Missing user ID or group ID" });
  }

  try {
    const group = await Conversation.findOne({
      _id: groupId,
      isGroup: true,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only admins can delete the group
    const isAdmin = group.admin.some((adminId) => adminId.equals(userId));

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can delete the group" });
    }

    // Delete all messages related to the group
    await Message.deleteMany({ conversationId: groupId });

    // Delete the group itself
    await Conversation.deleteOne({ _id: groupId });

    // Notify group members via socket.io
    io.to(groupId).emit("groupDeleted", { groupId });

    return res
      .status(200)
      .json({ message: "Group and all messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptGroupInvitation = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user?.id || req.user?._id;

  if (!groupId || !userId) {
    return res.status(400).json({ message: "Missing group ID or user ID" });
  }

  try {
    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isGroup) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // Make sure we properly compare ObjectIds
    const alreadyMember = group.participants.some((participantId) =>
      participantId.equals(userId)
    );

    if (alreadyMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.participants.push(new mongoose.Types.ObjectId(userId));
    await group.save();

    return res
      .status(200)
      .json({ message: "Group invitation accepted", group });
  } catch (error) {
    console.error("Error accepting group invitation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectGroupInvitation = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user?.id || req.user?._id;

  if (!groupId || !userId) {
    return res.status(400).json({ message: "Missing group ID or user ID" });
  }

  try {
    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isGroup) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // Check if the user was actually invited
    const wasInvited = group.invitedUsers.some((invitedId) =>
      invitedId.equals(userId)
    );

    if (!wasInvited) {
      return res
        .status(400)
        .json({ message: "You have not been invited to this group" });
    }

    // Remove the user from the invited list
    group.invitedUsers = group.invitedUsers.filter(
      (invitedId) => !invitedId.equals(userId)
    );

    await group.save();

    return res.status(200).json({ message: "Group invitation rejected" });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const exitGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user?.id || req.user?._id;

  if (!groupId || !userId) {
    return res.status(400).json({ message: "Missing group ID or user ID" });
  }

  try {
    const group = await Conversation.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.isGroup)
      return res.status(400).json({ message: "Not a group chat" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!group.participants.some((id) => id.equals(userObjectId))) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    if (
      group.participants.length === 1 &&
      group.participants[0].equals(userObjectId)
    ) {
      // Last member tries to leave
      group.isDeleted = true;
      await group.save();
      return res
        .status(200)
        .json({ message: "Group deleted as last member left" });
    }

    const isCreator =
      group.admin.length > 0 && group.admin[0].equals(userObjectId);

    if (isCreator) {
      // Transfer ownership or delete group if no one else
      const otherAdmins = group.admin.filter(
        (adminId) => !adminId.equals(userObjectId)
      );
      if (otherAdmins.length > 0) {
        group.admin = otherAdmins;
      } else {
        const otherParticipants = group.participants.filter(
          (id) => !id.equals(userObjectId)
        );
        if (otherParticipants.length === 0) {
          group.isDeleted = true;
          await group.save();
          return res
            .status(200)
            .json({ message: "Group deleted as no members left" });
        } else {
          group.admin = [otherParticipants[0]];
        }
      }
      group.participants = group.participants.filter(
        (id) => !id.equals(userObjectId)
      );
      await group.save();
      return res
        .status(200)
        .json({ message: "Ownership transferred and you left the group" });
    } else {
      // Normal user leaves
      group.participants = group.participants.filter(
        (id) => !id.equals(userObjectId)
      );
      group.admin = group.admin.filter((id) => !id.equals(userObjectId));
      await group.save();
      return res.status(200).json({ message: "You have left the group" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addUserToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userIdToAdd } = req.body; // user ID of the person to add
  const requestingUserId = req.user?.id || req.user?._id;

  if (!groupId || !userIdToAdd) {
    return res
      .status(400)
      .json({ message: "Missing group ID or user ID to add" });
  }

  try {
    const group = await Conversation.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.isGroup)
      return res.status(400).json({ message: "This is not a group chat" });

    // Optional: Check if requesting user is admin
    if (!group.admin.some((adminId) => adminId.equals(requestingUserId))) {
      return res
        .status(403)
        .json({ message: "Only admins can add users to the group" });
    }

    const userObjectIdToAdd = new mongoose.Types.ObjectId(userIdToAdd);

    if (group.participants.some((id) => id.equals(userObjectIdToAdd))) {
      return res.status(400).json({ message: "User is already a participant" });
    }

    // Add user directly as participant or to invitedUsers
    group.participants.push(userObjectIdToAdd);

    await group.save();

    return res.status(200).json({ message: "User added to the group", group });
  } catch (error) {
    console.error("Error adding user to group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const generateGroupInviteLink = async (req, res) => {
  const { groupId } = req.params;
  const { expiresAt = null, maxUses = 10 } = req.body;
  const userId = req.user?.id || req.user?._id;

  try {
    const group = await Conversation.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.admin.some((adminId) => adminId.equals(userId))) {
      return res
        .status(403)
        .json({ message: "Only admins can generate invite links" });
    }

    // ✅ Clear existing invite tokens
    group.inviteTokens = [];

    // ✅ Create and add the new token
    const inviteTokenObj = createInviteToken({ expiresAt, maxUses });
    group.inviteTokens.push(inviteTokenObj);

    await group.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/join-group/${inviteTokenObj.token}`;

    return res.status(201).json({
      message: "Invite link created",
      inviteLink,
      token: inviteTokenObj.token,
      expiresAt: inviteTokenObj.expiresAt,
      maxUses: inviteTokenObj.maxUses,
    });
  } catch (error) {
    console.error("Error generating invite link:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const joinGroupByInviteLink = async (req, res) => {
  const { token } = req.params;
  const userId = req.user?.id || req.user?._id;

  if (!userId)
    return res.status(401).json({ message: "Authentication required" });

  try {
    // Find group with the invite token
    const group = await Conversation.findOne({
      "inviteTokens.token": token,
      isGroup: true,
    });

    if (!group)
      return res
        .status(404)
        .json({ message: "Invalid or expired invite link" });

    // Find the invite token object
    const inviteTokenObj = group.inviteTokens.find((t) => t.token === token);

    // Check expiration
    if (inviteTokenObj.expiresAt && inviteTokenObj.expiresAt < new Date()) {
      return res.status(410).json({ message: "Invite link has expired" });
    }

    // Check usage limit
    if (inviteTokenObj.uses >= inviteTokenObj.maxUses) {
      return res
        .status(410)
        .json({ message: "Invite link usage limit reached" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (group.participants.some((id) => id.equals(userObjectId))) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    // Add user to participants
    group.participants.push(userObjectId);

    // Increment usage count
    inviteTokenObj.uses += 1;

    // Optionally, remove token if maxUses reached
    if (inviteTokenObj.uses >= inviteTokenObj.maxUses) {
      group.inviteTokens = group.inviteTokens.filter((t) => t.token !== token);
    }

    await group.save();

    return res
      .status(200)
      .json({ message: "Joined group successfully", group });
  } catch (error) {
    console.error("Error joining group by invite link:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
