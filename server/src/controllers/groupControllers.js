import Conversation from "../models/Conversation.js";

export const getUserGroups = async (req, res) => {
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    const groups = await Conversation.find({
      participants: userId,
      isGroup: true,
    })
      .populate("participants", "username _id")
      .populate("admin", "username _id");

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: "No groups found for this user" });
    }

    return res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createGroup = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { name, participants = [], groupAvatar } = req.body;

  if (!userId || !name) {
    return res
      .status(400)
      .json({ message: "Group name and user ID are required" });
  }

  // Ensure creator is in the participant list
  const uniqueParticipants = new Set(participants.map(String));
  uniqueParticipants.add(String(userId)); // add creator if not included

  try {
    const newGroup = new Conversation({
      name,
      isGroup: true,
      participants: Array.from(uniqueParticipants).map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
      admin: [userId], // creator becomes admin
      groupAvatar: groupAvatar || null,
    });

    await newGroup.save();

    return res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error);
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
  const { expiresInHours, maxUses } = req.body; // optional params
  const userId = req.user?.id || req.user?._id;

  try {
    const group = await Conversation.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.isGroup)
      return res.status(400).json({ message: "Not a group chat" });

    // Only admins can create invite links
    if (!group.admin.some((adminId) => adminId.equals(userId))) {
      return res
        .status(403)
        .json({ message: "Only admins can generate invite links" });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(16).toString("hex");

    // Calculate expiration if requested
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 3600 * 1000)
      : null;

    group.inviteTokens.push({
      token,
      expiresAt,
      maxUses: maxUses || Infinity,
      uses: 0,
    });

    await group.save();

    // Return the full invite link URL (adjust domain accordingly)
    const inviteLink = `${process.env.FRONTEND_URL}/join-group/${token}`;

    return res.status(201).json({ message: "Invite link created", inviteLink });
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
      isDeleted: { $ne: true }, // if using soft delete
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
