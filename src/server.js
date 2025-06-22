import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import chatRoutes from "./routes/chat.route.js";
import chatParticipantRoutes from "./routes/chatParticipant.route.js";
import friendshipRoutes from "./routes/friendship.route.js";
import hobbyRoutes from "./routes/hobby.route.js";
import ratingRoutes from "./routes/rating.route.js";
import { PrismaClient } from "@prisma/client";
import { generalLimiter, authLimiter } from "./middleware/rateLimiter.js";
import job from "./config/cron.js";
dotenv.config();
const app = express();
const prisma = new PrismaClient();

job.start();
//middleware
app.use(express.json());
app.use("/api", generalLimiter); // Applies to all /api routes

const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chatParticipants", chatParticipantRoutes);
app.use("/api/friendships", friendshipRoutes);
app.use("/api/hobbies", hobbyRoutes);
app.use("/api/rating", ratingRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
