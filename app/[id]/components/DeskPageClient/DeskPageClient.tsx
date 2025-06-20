"use client";

import { WordCard } from "@/app/components/WordCard";
import { WordCardSkeleton } from "@/app/components/WordCardSkeleton";
import { Deck, Word, DeckWord, UserWordProgress } from "@prisma/client";
import { RecallButtons } from "@/app/components/RecallButtons";
import { EmptyState } from "./components/EmptyState";
import { useDesk } from "@/app/hooks/useDesk";

export type DeskWithWords = Deck & {
  words: (DeckWord & {
    word: Word & {
      userProgress: UserWordProgress[];
    };
  })[];
};

type DeskPageClientProps = {
  deck: DeskWithWords;
  isAuthenticated: boolean;
};

export function DeskPageClient({ deck, isAuthenticated }: DeskPageClientProps) {
  const {
    currentWord,
    isTransitioning,
    isCompleted,
    wordProgress,
    isLoading,
    handleProgress,
  } = useDesk(deck);

  if (isCompleted || deck.words.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={isTransitioning ? "pointer-events-none" : ""}>
          {isLoading ? (
            <WordCardSkeleton />
          ) : (
            <WordCard
              key={currentWord.id}
              word={{
                ...currentWord,
                globalStrength: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                imgUrl: currentWord.imgUrl || null,
              }}
              deckId={deck.id}
              strength={wordProgress?.strength}
              isAuthenticated={isAuthenticated}
            />
          )}
          <RecallButtons
            isLoading={isLoading}
            onProgress={handleProgress}
            showSkipButton={true}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}
