"use client";

import { Word, UserWordProgress } from "@prisma/client";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import { RecallButtons } from "../components/RecallButtons";
import { useReview } from "../hooks/useReview";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { CompletedState } from "./components/CompletedState/CompletedState";
import { WordCard } from "../components/WordCard/WordCard";

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
  const { currentWord, isTransitioning, isLoading, handleProgress, isClient } =
    useReview(initialWords);

  const canShowEmptyState = initialWords.length === 0;
  const canShowCompletedState = isClient && !isLoading && !currentWord;

  if (canShowEmptyState) {
    return <EmptyState />;
  }

  if (canShowCompletedState) {
    return <CompletedState />;
  }

  // Show skeleton during client initialization
  if (!isClient) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <WordCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className={isTransitioning ? "pointer-events-none" : ""}>
          {isLoading ? (
            <>
              <WordCardSkeleton />
            </>
          ) : (
            <>
              <WordCard
                key={currentWord?.word.id}
                word={currentWord!.word}
                deckId={currentWord!.deck.id}
                strength={currentWord!.strength}
                isAuthenticated={isAuthenticated}
              />
            </>
          )}
          <RecallButtons
            isLoading={isLoading}
            onProgress={handleProgress}
            isTransitioning={isTransitioning}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}
