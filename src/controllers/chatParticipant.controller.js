import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a participant
export const addParticipant = async (req, res) => {
  try {
    const { chatId, userId, role } = req.body;

    const participant = await prisma.chatParticipant.create({
      data: {
        chatId,
        userId,
        role,
      },
    });

    res.status(201).json({ participant });
  } catch (error) {
    console.error("Error adding participant", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all participants (optional: filter by chatId)
export const getAllParticipants = async (req, res) => {
  try {
    const participants = await prisma.chatParticipant.findMany();
    res.status(200).json({ participants });
  } catch (error) {
    console.error("Error fetching participants", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a participant by ID
export const getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await prisma.chatParticipant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({ participant });
  } catch (error) {
    console.error("Error getting participant", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a participant (e.g., role or leftAt)
export const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, leftAt } = req.body;

    const updatedParticipant = await prisma.chatParticipant.update({
      where: { id: parseInt(id) },
      data: {
        role,
        leftAt: leftAt ? new Date(leftAt) : undefined,
      },
    });

    res.status(200).json({ participant: updatedParticipant });
  } catch (error) {
    console.error("Error updating participant", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a participant
export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.chatParticipant.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: "Participant deleted", participant: deleted });
  } catch (error) {
    console.error("Error deleting participant", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
