import { prisma } from "@/lib/prisma";
import { HomePageClient } from "./HomePageClient";

export default async function Home() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
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

  const initialUsers = users.map((user) => {
    const uniqueWords = new Map();
    user.UserWordProgress.forEach((progress) => {
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
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          Users and Their Progress
        </h1>
        <HomePageClient initialUsers={initialUsers} />
      </div>
    </div>
  );
}
