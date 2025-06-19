"use client";

import { useState } from "react";
import { useReviewCount } from "../contexts/ReviewCountContext";
import { WordToReview } from "../review/ReviewPageClient";

export const useReview = (initialWords: WordToReview[]) => {
  const [words, setWords] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { decrementReviewCount } = useReviewCount();

  const currentWord = words[currentIndex];

  const handleRecallLevel = async (levelId?: number) => {
    if (!currentWord) return;

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
      decrementReviewCount();
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleProgress = async (levelId?: number) => {
    if (!currentWord) return;

    setIsTransitioning(true);
    setIsLoading(true);
    await handleRecallLevel(levelId);
    setTimeout(() => {
      setWords((prev) => prev.filter((_, i) => i !== currentIndex));
      setCurrentIndex(0);
      setIsTransitioning(false);
      setIsLoading(false);
    }, 500);
  };

  return {
    currentWord,
    isTransitioning,
    isLoading,
    handleProgress,
  };
};
