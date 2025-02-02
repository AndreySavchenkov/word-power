import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DeckPageClient } from "./DeckPageClient";

export default async function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();

  const id = (await params).id

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const deck = await prisma.deck.findUnique({
    where: { id: id },
    include: {
      words: {
        include: {
          word: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!deck) {
    redirect("/decks");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user || deck.userId !== user.id) {
    redirect("/decks");
  }

  return <DeckPageClient deck={deck} />;
}
