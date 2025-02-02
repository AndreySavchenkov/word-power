import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { wordId, strength } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  try {
    // Обновляем или создаем запись о прогрессе
    const progress = await prisma.userWordProgress.upsert({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId: wordId,
        },
      },
      update: {
        strength: strength,
        lastReviewed: new Date(),
        nextReview: calculateNextReview(strength),
      },
      create: {
        userId: user.id,
        wordId: wordId,
        strength: strength,
        lastReviewed: new Date(),
        nextReview: calculateNextReview(strength),
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to save progress:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function calculateNextReview(strength: number): Date {
  const now = new Date();
  const intervals = {
    1: 1, // 1 день для "Don't know"
    2: 3, // 3 дня для "Hard"
    3: 7, // 7 дней для "Good"
    4: 14, // 14 дней для "Easy"
  };

  const days = intervals[strength as keyof typeof intervals] || 1;
  now.setDate(now.getDate() + days);
  return now;
}
