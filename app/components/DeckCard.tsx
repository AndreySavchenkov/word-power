"use client";

import Link from "next/link";
import { LevelBadge } from "./LevelBadge";

interface DeckProps {
  deck: {
    id: string;
    name: string;
    description?: string;
    category: string;
    level: string;
    wordsCount?: number;
  };
  isAuthenticated: boolean;
}

export const DeckCard = ({ deck }: DeckProps) => {
  return (
    <Link href={`/${deck.id}`}>
      <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{deck.name}</h3>
          {deck.description && (
            <p className="text-sm text-gray-400">{deck.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LevelBadge level={deck.level} />
          <span className="text-sm text-gray-400">{deck.category}</span>
          {deck.wordsCount !== undefined && (
            <span className="text-sm text-gray-400">
              {deck.wordsCount} {deck.wordsCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
