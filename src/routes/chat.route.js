import express from "express";
import {
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", createChat);
router.get("/", getChats);
router.get("/:id", getChatById);
router.put("/:id", updateChat);
router.delete("/:id", deleteChat);

export default router;
