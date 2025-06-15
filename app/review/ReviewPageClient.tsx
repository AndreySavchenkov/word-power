"use client";

import { Word, UserWordProgress } from "@prisma/client";
import { WordCard } from "../components/WordCard";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import { RecallButtons } from "../components/RecallButtons";
import { useReview } from "../hooks/useReview";

export type WordToReview = UserWordProgress & {
  word: Omit<Word, "level"> & {
    level: Word["level"] | null;
  };
  deck: {
    id: string;
    name: string;
  };
};

type ReviewPageClientProps = {
  words: WordToReview[];
  isAuthenticated: boolean;
};

export function ReviewPageClient({
  words: initialWords,
  isAuthenticated,
}: ReviewPageClientProps) {
  const { currentWord, isTransitioning, isLoading, handleProgress } =
    useReview(initialWords);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className={isTransitioning ? "pointer-events-none" : ""}>
          {isLoading ? (
            <>
              <WordCardSkeleton />
              <RecallButtons
                onProgress={handleProgress}
                isTransitioning={isTransitioning}
                isAuthenticated={isAuthenticated}
              />
            </>
          ) : (
            <>
              <WordCard
                key={currentWord.word.id}
                word={currentWord.word}
                deckId={currentWord.deck.id}
                strength={currentWord.strength}
                isAuthenticated={isAuthenticated}
              />
              <RecallButtons
                onProgress={handleProgress}
                isTransitioning={isTransitioning}
                isAuthenticated={isAuthenticated}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
