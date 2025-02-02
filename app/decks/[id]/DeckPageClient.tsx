"use client";

import { WordCard } from "@/app/components/WordCard";
import Link from "next/link";
import { Deck, Word, DeckWord } from "@prisma/client";
import { useState } from "react";

type DeckWithWords = Deck & {
  words: (DeckWord & {
    word: Word;
  })[];
};

interface DeckPageClientProps {
  deck: DeckWithWords;
}

export function DeckPageClient({ deck }: DeckPageClientProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleProgress = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentWordIndex < deck.words.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        setIsCompleted(true);
      }
    }, 500);
  };

  const currentWord = deck.words[currentWordIndex]?.word;

  if (isCompleted || deck.words.length === 0) {
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
              All cards completed!
            </h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              Great job! You&apos;ve reviewed all the cards in this deck. Would
              you like to try another deck?
            </p>
            <Link
              href="/decks"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Decks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`space-y-8 ${
            isTransitioning ? "pointer-events-none" : ""
          }`}
        >
          <WordCard
            key={currentWord.id}
            word={{
              id: currentWord.id,
              eng: currentWord.eng,
              partOfSpeech: currentWord.partOfSpeech,
              level: currentWord.level || undefined,
              pronunciation: currentWord.pronunciation,
              definition: currentWord.definition,
              examples: currentWord.examples,
              imgUrl: currentWord.imgUrl || "",
              videoUrls: currentWord.videoUrls,
            }}
            deckId={deck.id}
            onProgress={handleProgress}
          />
        </div>
      </div>
    </div>
  );
}
