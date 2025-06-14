import { getLevelWeight } from "./levelWeight";
import { Word } from "@prisma/client";

type WordWithProgress = Word & {
  userProgress: {
    id: string;
    userId: string;
    wordId: string;
    strength: number;
    lastReviewed: Date;
    nextReview: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

type DeckWord = {
  id: string;
  wordId: string;
  deckId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  word: WordWithProgress;
};

export function sortWords(words: DeckWord[]) {
  return [...words].sort((a, b) => {
    const levelWeightA = getLevelWeight(a.word.level);
    const levelWeightB = getLevelWeight(b.word.level);

    if (levelWeightA !== levelWeightB) {
      return levelWeightA - levelWeightB;
    }

    if (!a.word.userProgress?.[0] && b.word.userProgress?.[0]) return -1;
    if (a.word.userProgress?.[0] && !b.word.userProgress?.[0]) return 1;

    if (a.word.userProgress?.[0] && b.word.userProgress?.[0]) {
      return (
        (a.word.userProgress[0].strength || 0) -
        (b.word.userProgress[0].strength || 0)
      );
    }

    return a.order - b.order;
  });
}
