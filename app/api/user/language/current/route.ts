import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { language: true },
    });

    return NextResponse.json({ language: user?.language });
  } catch (err) {
    console.error("Ошибка сервера:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
