import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new hobby
export const createHobby = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Hobby name is required." });

  try {
    const hobby = await prisma.hobby.create({
      data: { name },
    });

    res.status(201).json({ hobby });
  } catch (error) {
    console.error("Error creating hobby:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all hobbies
export const getAllHobbies = async (req, res) => {
  try {
    const hobbies = await prisma.hobby.findMany();
    res.status(200).json({ hobbies });
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a hobby
export const deleteHobby = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHobby = await prisma.hobby.delete({
      where: {
        id: parseInt(id), // Important! id must be an integer
      },
    });

    res.status(200).json({ message: "Hobby deleted", hobby: deletedHobby });
  } catch (error) {
    console.error("Error deleting hobby:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHobby = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Hobby name is required" });
    }

    const updatedHobby = await prisma.hobby.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json({ hobby: updatedHobby });
  } catch (error) {
    console.error("Error updating hobby", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Assign a hobby to a user
export const assignHobbyToUser = async (req, res) => {
  try {
    const { userId, hobbyId } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hobbies: {
          connect: { id: hobbyId },
        },
      },
      include: { hobbies: true },
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error assigning hobby to user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a hobby from a user
export const removeHobbyFromUser = async (req, res) => {
  try {
    const { userId, hobbyId } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hobbies: {
          disconnect: { id: hobbyId },
        },
      },
      include: { hobbies: true },
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error removing hobby from user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
