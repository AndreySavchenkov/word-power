import { prisma } from "@/lib/prisma";
import { DeckCard } from "./components/DeckCard";
import { getServerSession } from "next-auth";

export default async function DecksPage() {
  const session = await getServerSession();

  const decks = await prisma.deck.findMany({
    include: {
      _count: {
        select: { words: true },
      },
    },
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={{
                ...deck,
                description: deck.description || undefined,
                wordsCount: deck._count.words,
              }}
              isAuthenticated={!!session?.user}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
