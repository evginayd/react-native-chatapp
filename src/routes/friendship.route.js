import express from "express";
import {
  sendFriendRequest,
  updateFriendRequest,
  deleteFriendship,
  getFriendshipsForUser,
} from "../controllers/friendship.controller.js";

const router = express.Router();

router.post("/", sendFriendRequest);
router.put("/:id", updateFriendRequest);
router.delete("/:id", deleteFriendship);
router.get("/:userId", getFriendshipsForUser);

export default router;
