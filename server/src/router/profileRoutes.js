import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/profileControllers.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.post("/update", requireAuth, updateProfile);

export default router;
