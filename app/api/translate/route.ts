import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { text } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { language: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${
        user.language
      }&dt=t&dt=at&dt=rm&dt=bd&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();

    let translation = data[0][0][0];

    // Если есть альтернативные переводы, выбираем наиболее подходящий
    if (data[1]) {
      const alternatives = data[1].map(
        (item: [string, ...unknown[]]) => item[0]
      );
      // Выбираем самый длинный перевод как наиболее контекстный
      const contextualTranslation = alternatives.reduce(
        (a: string, b: string) => (a.length > b.length ? a : b)
      );
      translation = contextualTranslation || translation;
    }

    return NextResponse.json({ translation });
  } catch (err) {
    console.error("Ошибка перевода:", err);
    return NextResponse.json({ error: "Ошибка перевода" }, { status: 500 });
  }
}
