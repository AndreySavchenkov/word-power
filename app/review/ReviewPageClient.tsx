"use client";

import { useState } from "react";
import { Word, UserWordProgress } from "@prisma/client";
import { WordCard } from "../components/WordCard";

type WordToReview = UserWordProgress & {
  word: Omit<Word, "level"> & {
    level: Word["level"] | null;
  };
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
      setCurrentIndex(0);
      setIsTransitioning(false);
    }, 500);
  };

  if (words.length === 0) {
    return null;
  }

  const currentWord = words[currentIndex];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
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
