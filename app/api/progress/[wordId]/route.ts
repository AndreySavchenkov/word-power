import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ wordId: string }> }
) {
  const session = await getServerSession();

  const wordId = (await params).wordId;

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  try {
    const progress = await prisma.userWordProgress.findUnique({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId,
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
