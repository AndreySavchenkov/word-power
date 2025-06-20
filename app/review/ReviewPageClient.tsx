"use client";

import { Word, UserWordProgress } from "@prisma/client";
import { WordCard } from "../components/WordCard";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import { RecallButtons } from "../components/RecallButtons";
import { useReview } from "../hooks/useReview";
import Link from "next/link";

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

  if (initialWords.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-gray-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              You have no words to review
            </h2>
            <p className="text-gray-500 mb-6">
              Add words to decks and start learning to see them here for review.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to decks
            </Link>
          </div>
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
              <RecallButtons
                key="loading-buttons"
                onProgress={handleProgress}
                isTransitioning={isTransitioning}
                isAuthenticated={isAuthenticated}
              />
            </>
          ) : currentWord ? (
            <>
              <WordCard
                key={currentWord.word.id}
                word={currentWord.word}
                deckId={currentWord.deck.id}
                strength={currentWord.strength}
                isAuthenticated={isAuthenticated}
              />
              <RecallButtons
                key={`buttons-${currentWord.word.id}`}
                onProgress={handleProgress}
                isTransitioning={isTransitioning}
                isAuthenticated={isAuthenticated}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="text-gray-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Review completed!
              </h2>
              <p className="text-gray-500 mb-6">
                You have reviewed all words. Come back later for the next
                review.
              </p>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to decks
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
