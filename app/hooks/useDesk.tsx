import { UserWordProgress } from "@prisma/client";
import { useState, useEffect } from "react";
import { DeskWithWords } from "../[id]/components/DeskPageClient/DeskPageClient";

export const useDesk = (deck: DeskWithWords) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wordProgress, setWordProgress] = useState<UserWordProgress | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      const currentWordId = deck.words[currentWordIndex]?.word.id;
      if (!currentWordId) return;

      try {
        const response = await fetch(`/api/progress/${currentWordId}`);
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
  }, [currentWordIndex, deck.words]);

  const handleProgress = async (levelId?: number) => {
    setIsTransitioning(true);
    if (levelId) {
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
    try {
      await fetch("/api/progress", {
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
