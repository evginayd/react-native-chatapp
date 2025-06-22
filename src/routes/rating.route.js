import express from "express";
import { rateUser } from "../controllers/rating.controller.js";

const router = express.Router();

// This allows POST to /api/rating/:userId
router.post("/:userId", rateUser);

export default router;
