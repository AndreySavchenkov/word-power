import Link from "next/link";
import { LevelBadge } from "./LevelBadge";

interface DeskProps {
  desk: {
    id: string;
    name: string;
    description?: string;
    category: string;
    level: string;
    wordsCount?: number;
  };
  isAuthenticated: boolean;
}

export const DeskCard = ({ desk }: DeskProps) => {
  return (
    <Link href={`/${desk.id}`}>
      <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{desk.name}</h3>
          {desk.description && (
            <p className="text-sm text-gray-400">{desk.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LevelBadge level={desk.level} />
          <span className="text-sm text-gray-400">{desk.category}</span>
          {desk.wordsCount !== undefined && (
            <span className="text-sm text-gray-400">
              {desk.wordsCount} {desk.wordsCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
