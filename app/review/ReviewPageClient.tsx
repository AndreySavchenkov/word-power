"use client";

import { useState } from "react";
import { Word, UserWordProgress, Deck } from "@prisma/client";
import { WordCard } from "../components/WordCard";
import Link from "next/link";

type WordToReview = UserWordProgress & {
  word: Word;
  deck: {
    id: string;
    name: string;
  };
};

interface ReviewPageClientProps {
  words: WordToReview[];
}

export function ReviewPageClient({
  words: initialWords,
}: ReviewPageClientProps) {
  const [words, setWords] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleProgress = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setWords((prev) => prev.filter((_, i) => i !== currentIndex));
      setIsTransitioning(false);
    }, 500);
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-100">
              All reviews completed!
            </h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              Great job! You've reviewed all your cards for now. Come back later
              for more reviews.
            </p>
            <Link
              href="/decks"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Decks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">
            Words to Review ({words.length})
          </h1>
          <p className="text-gray-400">From deck: {currentWord.deck.name}</p>
        </div>
        <div
          className={`space-y-8 ${
            isTransitioning ? "pointer-events-none" : ""
          }`}
        >
          <WordCard
            key={currentWord.word.id}
            word={currentWord.word}
            deckId={currentWord.deck.id}
            onProgress={handleProgress}
            strength={currentWord.strength}
          />
        </div>
      </div>
    </div>
  );
}
