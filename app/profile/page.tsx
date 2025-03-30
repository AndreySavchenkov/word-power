import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserCard } from "@/app/components/UserCard";
import { SignOutButton } from "@/app/components/SignOutButton";
import { LanguageSelector } from "@/app/components/LanguageSelector";
import { ActivityHeatmap } from "@/app/components/ActivityHeatmap";

const transformUserData = (user: {
  name: string | null;
  id: string;
  email: string | null;
  image: string | null;
  UserWordProgress: {
    id: string;
    wordId: string;
    strength: number;
    lastReviewed: Date;
  }[];
}) => {
  const uniqueWords = new Map();

  user.UserWordProgress.forEach((progress: { wordId: string }) => {
    uniqueWords.set(progress.wordId, progress);
  });

  const progressArray = Array.from(uniqueWords.values());
  const totalWords = progressArray.length;
  const averageStrength = totalWords
    ? progressArray.reduce((acc, curr) => acc + curr.strength, 0) / totalWords
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
};

export default async function Profile() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      redirect("/api/auth/signin");
    }

    const timestamp = Date.now();

    const userStat = await prisma.user.findUnique({
      where: {
        email: session.user?.email || "",
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

    if (!userStat) {
      redirect("/");
    }

    const formattedUser = transformUserData(userStat);

    return (
      <div className={"my-auto max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div className="flex flex-col pt-24 gap-4 p-2">
          <h1 className="text-2xl font-bold text-gray-100">My Profile:</h1>

          <UserCard key={userStat.id} user={formattedUser} />

          <ActivityHeatmap
            key={`activity-${timestamp}`}
            userProgress={userStat.UserWordProgress}
          />

          <LanguageSelector initialLanguage={userStat.language} />

          <SignOutButton />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading profile:", error);
    redirect("/"); // При ошибке редиректим
  }
}
