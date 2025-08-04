import cloudinary from "../cloudinary/Cloudinary.js";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const profile = await User.findById(userId).select(
      "name nickname email bio avatarUrl"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { bio, avatarUrl, nickname } = req.body;

  try {
    // Check if at least one field is provided
    if (!bio && !avatarUrl && !nickname) {
      return res
        .status(400)
        .json({ message: "At least one field is required" });
    }

    // Validation
    if (nickname && nickname.length > 15) {
      return res
        .status(400)
        .json({ message: "Nickname must not exceed 15 characters" });
    }

    if (bio && bio.length > 100) {
      return res
        .status(400)
        .json({ message: "Bio must not exceed 100 characters" });
    }
    //cloudinary uploads the image
    const cloudinaryResult = await cloudinary.uploader.upload(avatarUrl);
    // Build update object
    const updateData = {};
    if (bio) updateData.bio = bio;
    if (cloudinaryResult) updateData.avatarUrl = cloudinaryResult.secure_url;
    if (nickname) updateData.nickname = nickname;

    // update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
