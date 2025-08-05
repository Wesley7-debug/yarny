import Status from "../models/Status.js";
import User from "../models/User.js";

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
      .populate("userId", "name") // include user info if needed
      .lean();

    res.status(200).json(statuses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get statuses", details: error.message });
  }
};

export const createStatus = async (req, res) => {
  try {
    const { userId, texts, images, videos } = req.body;

    // validate that at least one field is filled
    if (!texts?.length && !images?.length && !videos?.length) {
      return res.status(400).json({
        error: "At least one of texts, images, or videos is required.",
      });
    }

    const newStatus = new Status({
      userId,
      texts,
      images,
      videos,
    });

    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create status", details: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;

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
