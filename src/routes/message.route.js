// src/routes/messageRoutes.js
import express from "express";
import {
  createMessage,
  getMessageById,
  deleteMessage,
  getAllMessages,
  updateMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/:id", getMessageById);
router.delete("/:id", deleteMessage);
router.get("/", getAllMessages);
router.put("/:id", updateMessage);

export default router;
