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
    const currentProgress = await prisma.userWordProgress.findUnique({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId: wordId,
        },
      },
    });

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
        nextReview: calculateNextReview(strength, currentProgress?.strength),
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

function calculateNextReview(strength: number, currentStrength?: number): Date {
  const now = new Date();

  // Базовые интервалы для первого повторения
  const baseIntervals = {
    1: 1, // Don't know -> 1 день
    2: 3, // Hard -> 3 дня
    3: 7, // Good -> 7 дней
    4: 14, // Easy -> 14 дней
  };

  // Если текущая сила запоминания такая же или выше
  if (currentStrength && strength >= currentStrength) {
    // Увеличиваем интервал в 2-2.5 раза
    const multiplier = 2 + Math.random() * 0.5;
    const days = Math.round(
      baseIntervals[strength as keyof typeof baseIntervals] * multiplier
    );
    now.setDate(now.getDate() + days);
  } else {
    // Если ответ хуже предыдущего, используем базовый интервал
    const days = baseIntervals[strength as keyof typeof baseIntervals];
    now.setDate(now.getDate() + days);
  }

  return now;
}
