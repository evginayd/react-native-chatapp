import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const rateUser = async (req, res) => {
  const { userId, rating } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ message: "userId and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate new average rating
    const newRatingCount = user.ratingCount + 1;
    const newAverageRating =
      (user.averageRating * user.ratingCount + rating) / newRatingCount;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ratingCount: newRatingCount,
        averageRating: newAverageRating,
      },
    });

    res
      .status(200)
      .json({ message: "User rated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error rating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
