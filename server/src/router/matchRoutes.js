import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  DailyMatches,
  getDailyMatchFeed,
} from "../controllers/matchControllers.js";

const router = express.Router();
router.get("/daily-feed", requireAuth, getDailyMatchFeed);

router.post("/swipe", requireAuth, DailyMatches);

export default router;
