import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;

  if (!chatId || !senderId || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Failed to create message" });
  }
};

export const getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Failed to fetch message" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.message.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Message deleted", deleted });
  } catch (error) {
    console.error("Error deleting message:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Message not found" });
    } else {
      res.status(500).json({ message: "Failed to delete message" });
    }
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting messages", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Content is required to update the message." });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.status(200).json({ message: updatedMessage });
  } catch (error) {
    console.error("Error updating message", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
