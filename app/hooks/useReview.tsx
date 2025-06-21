"use client";

import { useState, useEffect } from "react";
import { useReviewCount } from "../contexts/ReviewCountContext";
import { WordToReview } from "../review/ReviewPageClient";

export const useReview = (initialWords: WordToReview[]) => {
  const [isClient, setIsClient] = useState(false);
  const [words, setWords] = useState<WordToReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { decrementReviewCount } = useReviewCount();

  // Initialize only on client
  useEffect(() => {
    setIsClient(true);
    setWords(initialWords);
  }, [initialWords]);

  const currentWord = words[currentIndex];

  const handleRecallLevel = async (levelId?: number) => {
    if (!currentWord) return;

    try {
      const response = await fetch("/api/progress", {
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

      if (response.status === 401) {
        console.log("User not authenticated, cannot save progress");

        return;
      }

      if (response.ok) {
        decrementReviewCount();
      }
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
    currentWord: isClient ? currentWord : null,
    isTransitioning,
    isLoading,
    handleProgress,
    isClient,
  };
};
