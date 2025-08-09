import express from "express";
import {
  Checkauth,
  checkNicknames,
  forgotPassword,
  Logout,
  resetPassword,
  SignIn,
  SignUp,
  verifyEmail,
} from "../controllers/authControllers.js";

const router = express.Router();

//routes for authentication
router.get("/", Checkauth);
router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.post("/logout", Logout);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.get("/check-nickname", checkNicknames);

export default router;
