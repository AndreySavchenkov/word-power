import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        UserWordProgress: {
          select: {
            id: true,
            strength: true,
            lastReviewed: true,
          },
          orderBy: {
            lastReviewed: "desc",
          },
        },
      },
    });

    const usersWithProgress = users.map((user) => {
      const uniqueWords = new Map();
      user.UserWordProgress.forEach((progress) => {
        uniqueWords.set(progress.id, progress);
      });

      const progressArray = Array.from(uniqueWords.values());
      const totalWords = progressArray.length;
      const averageStrength = totalWords
        ? progressArray.reduce((acc, curr) => acc + curr.strength, 0) /
          totalWords
        : 0;

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        progress: {
          totalWords,
          averageStrength,
        },
      };
    });

    return NextResponse.json(usersWithProgress);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
