"use client";

import { useState } from "react";
import { Word, UserWordProgress } from "@prisma/client";
import { WordCard } from "../components/WordCard";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import { RecallButtons } from "../components/RecallButtons";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleRecallLevel = async (levelId?: number) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: currentWord.wordId,
          strength: levelId,
          deckId: currentWord.deck.id,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleProgress = async (levelId?: number) => {
    setIsTransitioning(true);
    setIsLoading(true);
    console.log(currentWord)
    await handleRecallLevel(levelId)
    setTimeout(() => {
      setWords((prev) => prev.filter((_, i) => i !== currentIndex));
      setCurrentIndex(0);
      setIsTransitioning(false);
      setIsLoading(false);
    }, 500);
  };

  if (words.length === 0) {
    return null;
  }

  const currentWord = words[currentIndex];

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
              />
            </>
          ) : (
            <>
              <WordCard
                key={currentWord.word.id}
                word={currentWord.word}
                deckId={currentWord.deck.id}
                strength={currentWord.strength}
              />
              <RecallButtons
                onProgress={handleProgress}
                isTransitioning={isTransitioning}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
