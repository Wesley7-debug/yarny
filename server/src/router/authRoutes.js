import express from "express";
import {
  Checkauth,
  forgotPassword,
  Logout,
  resetPassword,
  SignIn,
  SignUp,
  verifyEmail,
} from "../controllers/authControllers.js";

const router = express.Router();

//routes for authentication
router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.post("/logout", Logout);
router.get("/check-auth", Checkauth);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
