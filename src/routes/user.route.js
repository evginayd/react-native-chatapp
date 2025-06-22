import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getUserById,
  deleteUser,
  updateUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", protect, getUserById);
router.delete("/:id", protect, deleteUser);
router.put("/:id", protect, updateUserById);
export default router;
