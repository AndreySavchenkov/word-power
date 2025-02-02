import Link from "next/link";

interface DeckProps {
  deck: {
    id: string;
    name: string;
    description?: string;
    category: string;
    level: string;
    wordsCount?: number;
  };
}

export const DeckCard = ({ deck }: DeckProps) => {
  return (
    <Link href={`/decks/${deck.id}`}>
      <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{deck.name}</h3>
          {deck.description && (
            <p className="text-sm text-gray-400">{deck.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs">
            {deck.level}
          </span>
          <span className="text-sm text-gray-400">{deck.category}</span>
          {deck.wordsCount !== undefined && (
            <span className="text-sm text-gray-400">
              {deck.wordsCount} слов
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
