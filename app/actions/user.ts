import { prisma } from "@/lib/prisma";

export async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  return user;
} 

export async function getUserStats(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email || "",
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      language: true,
      UserWordProgress: {
        select: {
          id: true,
          strength: true,
          lastReviewed: true,
          wordId: true,
        },
        orderBy: {
          lastReviewed: "desc",
        },
      },
    },
  });

  return user;
}