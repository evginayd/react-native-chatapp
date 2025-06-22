import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createChat = async (req, res) => {
  try {
    const { type, participantIds, isTemporary = true, expiresAt } = req.body;

    if (!Array.isArray(participantIds) || participantIds.length < 1) {
      return res.status(400).json({
        message: "participantIds must be an array with at least one user id",
      });
    }

    const chat = await prisma.chat.create({
      data: {
        type,
        isTemporary,
        expiresAt,
        participants: {
          create: participantIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    res.status(201).json({ chat });
  } catch (error) {
    console.error("Error creating chat", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChats = async (req, res) => {
  try {
    const { userId } = req.query;

    const where = userId
      ? {
          participants: {
            some: { userId },
          },
        }
      : {};

    const chats = await prisma.chat.findMany({
      where,
      include: {
        participants: {
          include: { user: true },
        },
        messages: true,
      },
    });

    res.status(200).json({ chats });
  } catch (error) {
    console.error("Error fetching chats", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: true },
        },
        messages: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json({ chat });
  } catch (error) {
    console.error("Error fetching chat", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateChat = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { participantIds, type, isTemporary, expiresAt } = req.body;

    if (!Array.isArray(participantIds)) {
      return res
        .status(400)
        .json({ message: "participantIds must be an array" });
    }

    const updatedChat = await prisma.chat.update({
      where: { id },
      data: {
        type,
        isTemporary,
        expiresAt,
        participants: {
          deleteMany: {},
          create: participantIds.map((userId) => ({ userId })),
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    res.status(200).json({ chat: updatedChat });
  } catch (error) {
    console.error("Error updating chat", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChat = async (req, res) => {
  const chatId = Number(req.params.id);

  try {
    const deletedChat = await prisma.chat.delete({
      where: { id: chatId },
    });

    res.status(200).json({ message: "Chat deleted", chat: deletedChat });
  } catch (error) {
    console.error("Error deleting chat:", error);

    if (error.code === "P2025") {
      // Prisma error: record not found
      res.status(404).json({ message: "Chat not found" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
