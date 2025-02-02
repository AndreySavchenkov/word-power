import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReviewPageClient } from "./ReviewPageClient";

export default async function ReviewPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    redirect("/");
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
  });

  // Преобразуем данные в нужный формат
  const formattedWords = wordsToReview.map((progress) => ({
    ...progress,
    deck: {
      id: progress.word.decks[0].deck.id,
      name: progress.word.decks[0].deck.name,
    },
  }));

  return <ReviewPageClient words={formattedWords} />;
}
