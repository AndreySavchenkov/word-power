import { prisma } from "@/lib/prisma";

export async function getWordsToReview(userId: string) {
  const now = new Date();
  const words = await prisma.userWordProgress.findMany({
    where: {
      userId,
      nextReview: {
        lte: now,
      },
    },
    include: {
      word: {
        include: {
          decks: {
            take: 1,
            include: {
              deck: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [
      {
        word: {
          level: "asc",
        },
      },
      {
        strength: "asc",
      },
    ],
  });

  return words;
}
