import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

export default router;
