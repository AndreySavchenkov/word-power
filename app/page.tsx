import { prisma } from "@/lib/prisma";
import { UserCard } from "./components/UserCard";

export default async function Home() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      UserWordProgress: {
        select: {
          strength: true,
        },
      },
    },
  });

  const usersWithProgress = users.map((user) => {
    const totalWords = user.UserWordProgress.length;
    const averageStrength = totalWords
      ? user.UserWordProgress.reduce((acc, curr) => acc + curr.strength, 0) /
        totalWords
      : 0;

    return {
      ...user,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersWithProgress.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
