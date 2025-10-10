import Status from "../models/Status.js";
import User from "../models/User.js";

export const getMyStatus = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const statuses = await Status.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(statuses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get your statuses", details: error.message });
  }
};
export const getVisibleStatuses = async (req, res) => {
  try {
    const userId = req.user._id; // assuming you're using auth middleware

    // 1. Get the user's friends
    const user = await User.findById(userId).select("friends");

    const friendIds = user.friends.map((id) => id.toString());

    // 2. Query statuses by user or friends, and not expired
    const now = new Date();

    const statuses = await Status.find({
      userId: { $in: [userId.toString(), ...friendIds] },
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 }) // newest first
      .populate("userId", "nickname") // include user info if needed
      .lean();

    res.status(200).json(statuses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get statuses", details: error.message });
  }
};

export const createStatus = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  try {
    const { texts = [], images = [], videos = [], color } = req.body;

    if (!texts.length && !images.length && !videos.length) {
      return res.status(400).json({
        error: "At least one of texts, images, or videos is required.",
      });
    }

    const newStatus = new Status({
      userId,
      texts,
      images, // Expecting [{ url, caption }]
      videos, // Same
      color,
    });

    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create status",
      details: error.message,
    });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Status ID is required" });
    }

    const deleted = await Status.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Status not found" });
    }

    res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete status", details: error.message });
  }
};
