import express from "express";
import {
  addParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../controllers/chatParticipant.controller.js";

const router = express.Router();

router.post("/", addParticipant);
router.get("/", getAllParticipants);
router.get("/:id", getParticipantById);
router.put("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

export default router;
