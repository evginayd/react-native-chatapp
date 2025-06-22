import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate random avatar URL using Dicebear and username as seed
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      username
    )}`;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        avatarUrl,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
