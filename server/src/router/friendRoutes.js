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
//remove user personal friend / unfriend
router.delete("/remove/:id", requireAuth, removeFriend);
//add friends to the user
router.post("/add-friend/:id", requireAuth, addFriend);
//get all the friend requests
router.get("/requests/:id", requireAuth, getFriendRequests);
//reject friend request
router.post("/reject-request/:id", requireAuth, RemoveFriendRequest);

export default router;
