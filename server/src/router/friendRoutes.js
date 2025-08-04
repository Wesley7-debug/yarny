import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  addFriend,
  getFriendRequests,
  getFriendsAllUser,
  removeFriend,
  RemoveFriendRequest,
} from "../controllers/friendControllers.js";

const router = express.Router();
//gets all friend the user has accepted
router.get("/", requireAuth, getFriendsAllUser);
//add friends to the user
router.post("/add-friend/:id", requireAuth, addFriend);
//get all the friend requests
router.get("/friend-request/:id", requireAuth, getFriendRequests);
//reject friend request
router.post("/reject-friend-request/:id", requireAuth, RemoveFriendRequest);

export default router;
