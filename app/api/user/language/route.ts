import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Language } from "@prisma/client";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { language } = await request.json();

    if (!Object.values(Language).includes(language)) {
      return NextResponse.json({ error: "Неверный язык" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { language },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Ошибка при обновлении языка:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
