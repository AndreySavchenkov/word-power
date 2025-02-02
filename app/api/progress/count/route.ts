import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

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
    const count = await prisma.userWordProgress.count({
      where: {
        userId: user.id,
        nextReview: {
          lte: new Date(),
        },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to fetch review count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
