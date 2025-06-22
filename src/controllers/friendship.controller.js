import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a friendship (send request)
export const sendFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  if (userId === friendId) {
    return res
      .status(400)
      .json({ message: "Cannot send request to yourself." });
  }

  try {
    const existing = await prisma.friendship.findUnique({
      where: {
        userId_friendId: { userId, friendId },
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Friend request already exists." });
    }

    const request = await prisma.friendship.create({
      data: {
        userId,
        friendId,
        status: "PENDING",
      },
    });

    res.status(201).json({ friendship: request });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept or decline request
export const updateFriendRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["ACCEPTED", "DECLINED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await prisma.friendship.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json({ friendship: updated });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a friendship
export const deleteFriendship = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.friendship.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: "Friendship deleted", friendship: deleted });
  } catch (error) {
    console.error("Error deleting friendship:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get friendships for a user
export const getFriendshipsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
      include: {
        user: true,
        friend: true,
      },
    });

    res.status(200).json({ friendships });
  } catch (error) {
    console.error("Error fetching friendships:", error);
    res.status(500).json({ message: "Server error" });
  }
};
