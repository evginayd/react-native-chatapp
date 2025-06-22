import express from "express";
import {
  createHobby,
  getAllHobbies,
  deleteHobby,
  assignHobbyToUser,
  removeHobbyFromUser,
  updateHobby,
} from "../controllers/hobby.controller.js";

const router = express.Router();

router.post("/", createHobby);
router.get("/", getAllHobbies);
router.delete("/:id", deleteHobby);
router.put("/:id", updateHobby); // <-- Add this line

// Manage user-hobby relationship
router.post("/assign", assignHobbyToUser);
router.post("/remove", removeHobbyFromUser);

export default router;
