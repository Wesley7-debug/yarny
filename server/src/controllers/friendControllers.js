import User from "../models/User.js";

export const getFriendsAllUser = async (req, res) => {
  const loggedInUser = req.user.id || req.user._id;

  try {
    // Find the logged-in user
    const user = await User.findById(loggedInUser)
      .populate("friends")
      .select(-loggedInUser);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return populated friends list
    return res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addFriend = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const friendId = req.params.id;

  if (!friendId) {
    return res.status(400).json({ message: "Friend ID is required" });
  }

  if (userId === friendId) {
    return res
      .status(400)
      .json({ message: "You cannot add yourself as a friend" });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Check if already friends
    const alreadyFriends = user.friends.includes(friendId);
    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Add each other
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();

    await friend.save();

    return res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFriend = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const friendId = req.params.id;
  if (!friendId) {
    return res.status(400).json({ message: "Friend ID is required" });
  }
  if (userId === friendId) {
    return res
      .status(400)
      .json({ message: "You cannot remove yourself as a friend" });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Remove each other
    user.friends.pull(friendId);
    friend.friends.pull(userId);
    //remove each other from the friend request array
    user.friendRequests.pull(friendId);
    friend.friendRequests.pull(userId);

    await user.save();
    await friend.save();

    return res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  const userId = req.user.id || req.user._id;

  try {
    const user = await User.findById(userId)
      .populate("friendRequests")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ friendRequests: user.friendRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RemoveFriendRequest = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { id: otherReqId } = req.params;
  if (!otherReqId) {
    return res.status(404).json({ message: "User or friend not found" });
  }
  try {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherReqId);

    if (!user || !otherUser) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Remove each other from the friend request array
    user.friendRequests.pull(otherReqId);
    otherUser.friendRequests.pull(userId);

    await user.save();
    await otherUser.save();

    return res
      .status(200)
      .json({ message: "Friend request removed successfully" });
  } catch (error) {
    console.error("Error removing friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
