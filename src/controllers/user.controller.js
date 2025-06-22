import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested user ID:", id);
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error returning the user", error);
    res.status(500).json({ message: "Error returning the user" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { username, bio, avatarUrl } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, bio, avatarUrl },
    });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
