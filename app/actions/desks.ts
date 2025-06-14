import { prisma } from "@/lib/prisma";

type UserWithId = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export async function getDesks() {
  const desks = await prisma.deck.findMany({
    include: {
      _count: {
        select: { words: true },
      },
    },
  });

  return desks;
}

export async function getDesk(id: string, user: UserWithId) {
  const deck = await prisma.deck.findUnique({
    where: { id: id },
    include: {
      words: {
        include: {
          word: {
            include: {
              userProgress: user
                ? {
                    where: {
                      userId: user.id,
                    },
                  }
                : undefined,
            },
          },
        },
      },
    },
  });

  return deck;
}