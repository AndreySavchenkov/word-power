import { UserWordProgress } from "@prisma/client";
import { useState, useEffect } from "react";
import { DeskWithWords } from "../[id]/components/DeskPageClient/DeskPageClient";

export const useDesk = (
  deck: DeskWithWords,
  isAuthenticated: boolean = false
) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wordProgress, setWordProgress] = useState<UserWordProgress | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated) {
        setWordProgress(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const currentWordId = deck.words[currentWordIndex]?.word.id;
      if (!currentWordId) return;

      try {
        const response = await fetch(`/api/progress/${currentWordId}`);

        if (response.status === 401) {
          console.log("User not authenticated, skipping progress fetch");
          setWordProgress(null);
          return;
        }

        if (response.ok) {
          const progress = await response.json();
          setWordProgress(progress);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [currentWordIndex, deck.words, isAuthenticated]);

  const handleProgress = async (levelId?: number) => {
    setIsTransitioning(true);
    if (levelId && isAuthenticated) {
      await handleRecallLevel(levelId);
    }
    setTimeout(() => {
      if (currentWordIndex < deck.words.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        setIsCompleted(true);
      }
    }, 500);
  };

  const handleRecallLevel = async (levelId: number) => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping progress save");
      return;
    }

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: currentWord.id,
          strength: levelId,
          deckId: deck.id,
        }),
      });

      if (response.status === 401) {
        console.log("User not authenticated, cannot save progress");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to save progress: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const currentWord = deck.words[currentWordIndex]?.word;

  return {
    currentWord,
    isTransitioning,
    isCompleted,
    wordProgress,
    isLoading,
    handleProgress,
  };
};
