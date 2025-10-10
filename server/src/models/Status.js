import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  texts: [String],

  images: [
    {
      url: String,
      caption: String,
    },
  ],
  videos: [
    {
      url: String,
      caption: String,
    },
  ],

  color: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: { expires: 0 },
  },
});

const Status = mongoose.model("Status", statusSchema);
export default Status;
