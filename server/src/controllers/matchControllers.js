import User from "../models/User.js";

export const getDailyMatchFeed = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    const today = new Date().toISOString().slice(0, 10);

    if (user.lastSwipeReset !== today) {
      user.swipeCounter = 0;
      user.lastSwipeReset = today;
    }

    if (user.swipeCounter >= 100) {
      return res
        .slice(403)
        .json({ message: "swipe count reached limit for today" });
    }
    user.swipeCounter++;
    await user.save();

    const excludedId = [userId, ...user.friends, ...user.friendRequests];

    const potentialMatches = await User.find({
      _id: { $nin: excludedId },
    }).limit(100);
  } catch (error) {}
};

export const DailyMatches = async (req, res) => {
  const userId = req.user.id;
  const { targetId, direction } = req.body;
  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    const today = new Date().toISOString().slice(0, 10);

    if (user.lastSwipeReset !== today) {
      user.swipeCounter = 0;
      user.lastSwipeReset = today;
    }

    if (user.swipeCounter >= 100) {
      return res
        .slice(403)
        .json({ message: "swipe count reached limit for today" });
    }
    user.swipeCounter++;
    await user.save();

    if (direction === "right") {
      const target = await User.findById(targetId);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }
      if (!target.friendRequests.includes(userId)) {
        target.friendRequests.push(userId);
        await target.save();
      }
      return res.status(200).json({ message: "friend request sent" });
    } else if (direction === "left") {
      return res.status(200).json({ message: "user skipped" });
    } else {
      return res.status(400).json({ message: "invalid direction" });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
