import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nickname: { type: String, unique: true },
    age: { type: Number, min: 13, max: 120 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    //RELATIONSHIPS
    swipeCounter: { type: Number, default: 0 },
    lastSwipeReset: { type: Date, default: new Date() },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bio: String,
    avatarUrl: String,
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
