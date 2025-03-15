import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ReviewPageClient } from "./ReviewPageClient";

export default async function ReviewPage() {
  const session = await getServerSession();
  const isAuthenticated = !!session?.user;

  if (!isAuthenticated) {
    return <ReviewPageClient words={[]} isAuthenticated={isAuthenticated} />;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    return <ReviewPageClient words={[]} isAuthenticated={isAuthenticated} />;
  }

  const now = new Date();
  const wordsToReview = await prisma.userWordProgress.findMany({
    where: {
      userId: user.id,
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

  // Преобразуем данные в нужный формат
  const formattedWords = wordsToReview.map((progress) => ({
    ...progress,
    deck: {
      id: progress.word.decks[0].deck.id,
      name: progress.word.decks[0].deck.name,
    },
  }));

  return (
    <ReviewPageClient
      words={formattedWords}
      isAuthenticated={isAuthenticated}
    />
  );
}
