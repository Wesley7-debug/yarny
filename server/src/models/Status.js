import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Array of text content (optional)
  texts: [
    {
      type: String,
    },
  ],

  // Array of image URLs or paths (optional)
  images: [
    {
      type: String,
    },
  ],

  // Array of video URLs or paths (optional)
  videos: [
    {
      type: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours later
    },
    index: { expires: 0 }, // TTL index for auto-deletion
  },
});

const Status = mongoose.model("Status", statusSchema);
export default Status;
