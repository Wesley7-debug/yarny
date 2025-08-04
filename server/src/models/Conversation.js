import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String },
    isGroup: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    groupAvatar: { type: String },
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    inviteTokens: [
      {
        token: { type: String, unique: true },
        expiresAt: { type: Date, required: false },
        maxUses: { type: Number, default: Infinity },
        uses: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
