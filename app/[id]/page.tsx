import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DeckPageClient } from "./DeckPageClient";
import { getLevelWeight } from "@/app/utils/levelWeight";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  const id = (await params).id;

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    redirect("/");
  }

  const deck = await prisma.deck.findUnique({
    where: { id: id },
    include: {
      words: {
        include: {
          word: {
            include: {
              userProgress: {
                where: {
                  userId: user.id,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!deck) {
    redirect("/decks");
  }

  // Преобразуем данные для сортировки
  const sortedWords = deck?.words.sort((a, b) => {
    // Сначала сортируем по уровню
    const levelWeightA = getLevelWeight(a.word.level);
    const levelWeightB = getLevelWeight(b.word.level);

    if (levelWeightA !== levelWeightB) {
      return levelWeightA - levelWeightB;
    }

    // Если уровни одинаковые, сортируем по силе запоминания
    if (!a.word.userProgress[0] && b.word.userProgress[0]) return -1;
    if (a.word.userProgress[0] && !b.word.userProgress[0]) return 1;

    if (a.word.userProgress[0] && b.word.userProgress[0]) {
      return (
        (a.word.userProgress[0].strength || 0) -
        (b.word.userProgress[0].strength || 0)
      );
    }

    return a.order - b.order;
  });

  // Обновляем deck.words отсортированным массивом
  if (deck && sortedWords) {
    deck.words = sortedWords;
  }

  return <DeckPageClient deck={deck} />;
}
