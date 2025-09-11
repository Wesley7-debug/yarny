import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwtUtils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { io } from "../../sockets/socket.js";

export const SignUp = async (req, res) => {
  const { name, nickname, email, password } = req.body;

  //checks if alll the input fields are complete
  if (!name || !nickname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //checks f0r existing emial and return an error if possible
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(402).json({ message: "User Email already exists" });
    }
    //hash the passwords
    const hashPassword = await bcrypt.hash(password, 10);
    //create the user

    const newUser = await User.create({
      name,
      nickname,
      email,
      password: hashPassword,
      isVerified: true,
    });
    //generate a token
    await generateToken(newUser._id, res);

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error at signing up user", error });
  }
};

export const SignIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "user not found" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token and set cookie
    await generateToken(existingUser._id, res);

    return res
      .status(200)
      .json({ message: "Signed in successfully", user: existingUser });
  } catch (error) {
    return res.status(500).json({
      message: "Server error at signing in user",
      error: error.message,
    });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const Checkauth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No authentication token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res
      .status(200)
      .json({ message: "User authenticated", userId: decoded.userId });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("reset-email", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Just return the token here directly
  return res.status(200).json({
    message: "Reset token generated successfully",
    token: resetToken,
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from the old one" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
};

export const checkNicknames = async (req, res) => {
  const { nickname } = req.query;
  if (!nickname) return res.json({ available: false });

  try {
    const exists = await User.findOne({ nickname });
    res.json({ available: !exists });
  } catch (error) {
    console.error("Error checking nickname:", error);
    res.status(500).json({ error: "Server error" });
  }
};
