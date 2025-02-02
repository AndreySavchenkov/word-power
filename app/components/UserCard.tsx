import Image from "next/image";

interface UserCardProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    progress: {
      totalWords: number;
      averageStrength: number;
    };
  };
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
      <div className="flex items-center gap-4 mb-4">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || "User"}
            className="rounded-full"
            width={64}
            height={64}
          />
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-100">{user.name}</h3>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Total words:</span>
          <span className="text-gray-100">{user.progress.totalWords}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Average strength:</span>
          <span className="text-gray-100">
            {user.progress.averageStrength.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
