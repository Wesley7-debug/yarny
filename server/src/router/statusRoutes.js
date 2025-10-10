import express from "express";
import {
  createStatus,
  deleteStatus,
  getMyStatus,
  getVisibleStatuses,
} from "../controllers/statusControllers.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/friends-status", requireAuth, getVisibleStatuses);
router.get("/my-status", requireAuth, getMyStatus);
router.post("/create-status", requireAuth, createStatus);
router.delete("/delete-status/statusId", requireAuth, deleteStatus);

export default router;
